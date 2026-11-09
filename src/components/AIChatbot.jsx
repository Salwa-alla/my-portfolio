
import React, { useEffect, useRef, useState } from 'react';

const MODEL_ID = 'gemini-3.5-flash-lite';
const MAX_ATTEMPTS = 3;
const REQUEST_TIMEOUT_MS = 35000;
const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

function waitForRetry(delay, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new Error('Request aborted'));
      return;
    }

    const timeoutId = setTimeout(() => {
      signal.removeEventListener('abort', handleAbort);
      resolve();
    }, delay);

    const handleAbort = () => {
      clearTimeout(timeoutId);
      signal.removeEventListener('abort', handleAbort);
      reject(new Error('Request aborted'));
    };

    signal.addEventListener('abort', handleAbort, { once: true });
  });
}

function getRetryDelay(response, attempt) {
  const backoff = 700 * 2 ** (attempt - 1);
  const retryAfter = response?.headers.get('Retry-After');
  let serverDelay = 0;

  if (retryAfter) {
    const seconds = Number(retryAfter);
    const dateDelay = Date.parse(retryAfter) - Date.now();
    serverDelay = Number.isFinite(seconds) ? seconds * 1000 : Math.max(0, dateDelay);
  }

  return Math.min(5000, Math.max(backoff, serverDelay)) + Math.random() * 250;
}

function getErrorMessage(error) {
  if (error.kind === 'blocked') {
    return 'Je ne peux pas répondre à cette demande. Essayez de la reformuler.';
  }

  if (error.kind === 'configuration') {
    return 'Le service IA n’est pas configuré. Veuillez réessayer ultérieurement.';
  }

  if (error.kind === 'empty') {
    return "Je n'ai pas reçu de réponse exploitable. Merci de réessayer.";
  }

  if (error.kind === 'invalid-response') {
    return 'Le service IA a renvoyé une réponse invalide. Merci de réessayer.';
  }

  if (error.status === 400) {
    return 'Votre demande n’a pas pu être traitée. Reformulez-la et réessayez.';
  }

  if (error.status === 401 || error.status === 403) {
    return 'Le service IA est indisponible pour le moment. Merci de réessayer plus tard.';
  }

  if (error.status === 404) {
    return 'Le modèle Gemini configuré n’est pas accessible pour ce compte. Vérifiez les modèles disponibles dans Google AI Studio.';
  }

  if (error.status === 429) {
    return 'Le service Gemini est très sollicité. Merci de réessayer dans quelques instants.';
  }

  if (error.status >= 500) {
    return 'Le service Gemini rencontre un problème temporaire. Merci de réessayer.';
  }

  if (error.name === 'AbortError' || error.kind === 'timeout') {
    return 'La réponse prend trop de temps. Merci de réessayer dans quelques instants.';
  }

  if (error instanceof TypeError) {
    return 'Connexion au service IA impossible. Vérifiez votre connexion, puis réessayez.';
  }

  return 'Une erreur est survenue. Merci de réessayer dans quelques instants.';
}

const SYSTEM_PROMPT = `
Tu es l'assistant virtuel de Salwa Alla, développeuse Front-End à Casablanca.

Compétences :
- React.js
- Next.js
- JavaScript
- TypeScript
- HTML5 et CSS3
- Redux Toolkit
- PHP et MySQL
- Git et GitHub

Projets :
- Stock Dashboard avec Next.js et Redux Toolkit.
- Sweet Treats avec React.js.
- Furni avec PHP et MySQL.
- Portfolio personnel avec React et Vite.

Formation :
- Formation Front-End Augmented AI.
- Licence Professionnelle en Ingénierie et Administration des Infrastructures Intelligentes (IA2I), en cours.

Contact :
- Les visiteurs peuvent contacter Salwa via le formulaire disponible sur son portfolio.
- Le formulaire contient les champs Nom, E-mail et Message. Il suffit de les remplir et de cliquer sur Envoyer.
- N'affirme jamais connaître son adresse e-mail ni son numéro de téléphone.

Réponds de manière professionnelle, claire et concise.
Réponds en français ou en arabe selon la langue du visiteur.
Ne donne jamais d'informations personnelles non mentionnées ici.
Si tu ne connais pas une information, dis-le clairement.
`;

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Bonjour ! 👋 Je suis l'assistant virtuel de Salwa. Comment puis-je vous aider ?"
    }
  ]);
  const messagesRef = useRef(messages);
  const requestInProgressRef = useRef(false);
  const activeControllerRef = useRef(null);
  const mountedRef = useRef(false);

  const quickQuestions = ['Compétences', 'Projets', 'Contact'];

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      activeControllerRef.current?.abort();
    };
  }, []);

  const appendMessage = (message) => {
    messagesRef.current = [...messagesRef.current, message];
    if (mountedRef.current) {
      setMessages(messagesRef.current);
    }
  };

  const handleSend = async (textToSend) => {
    const query = (textToSend ?? input).trim();

    if (!query || requestInProgressRef.current) return;

    requestInProgressRef.current = true;
    if (mountedRef.current) {
      setLoading(true);
      setInput('');
    }

    const userMessage = {
      role: 'user',
      content: query
    };
    const conversation = [...messagesRef.current, userMessage];
    appendMessage(userMessage);

    const controller = new AbortController();
    activeControllerRef.current = controller;
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
      if (!apiKey) {
        const error = new Error('API key is not configured');
        error.kind = 'configuration';
        throw error;
      }

      const contents = conversation
        .filter((message) => !message.isError && message.content)
        .map((message) => ({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }]
        }));

      let data;
      let lastError;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
        let response;
        try {
          response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${encodeURIComponent(apiKey)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
              body: JSON.stringify({
                systemInstruction: {
                  parts: [{ text: SYSTEM_PROMPT }]
                },
                contents,
                generationConfig: {
                  temperature: 0.7,
                  maxOutputTokens: 500
                }
              })
            }
          );

          const responseData = await response.json().catch(() => null);

          if (!response.ok) {
            const error = new Error('Gemini request failed');
            error.status = response.status;
            error.retryable = RETRYABLE_STATUSES.has(response.status);
            error.retryAfter = response;
            throw error;
          }

          if (!responseData) {
            const error = new Error('Gemini returned invalid JSON');
            error.kind = 'invalid-response';
            throw error;
          }

          data = responseData;
          break;
        } catch (error) {
          if (controller.signal.aborted) {
            throw error;
          }

          lastError = error;
          const canRetry = error.retryable || error instanceof TypeError;
          if (!canRetry || attempt === MAX_ATTEMPTS) {
            throw error;
          }

          await waitForRetry(getRetryDelay(error.retryAfter, attempt), controller.signal);
        }
      }

      if (!data) {
        throw lastError || new Error('Empty Gemini response');
      }

      const candidate = data.candidates?.[0];
      if (!candidate) {
        const error = new Error('Gemini returned no candidate');
        error.kind = data.promptFeedback?.blockReason ? 'blocked' : 'empty';
        throw error;
      }

      if (['SAFETY', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'SPII'].includes(candidate.finishReason)) {
        const error = new Error('Gemini blocked the response');
        error.kind = 'blocked';
        throw error;
      }

      const aiReply = candidate.content?.parts
        ?.map((part) => (typeof part.text === 'string' ? part.text : ''))
        .join('')
        .trim();

      if (!aiReply) {
        const error = new Error('Gemini returned an empty response');
        error.kind = 'empty';
        throw error;
      }

      appendMessage({ role: 'assistant', content: aiReply });
    } catch (error) {
      if (mountedRef.current) {
        const visibleError = controller.signal.aborted
          ? { name: 'AbortError', kind: 'timeout' }
          : error;
        appendMessage({
          role: 'assistant',
          content: getErrorMessage(visibleError),
          isError: true
        });
      }
    } finally {
      clearTimeout(timeoutId);
      activeControllerRef.current = null;
      requestInProgressRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '25px',
        right: '25px',
        zIndex: 9999
      }}
    >
      {/* Bouton flottant */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#06b6d4',
            color: '#fff',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          🤖
        </button>
      )}

      {/* Fenêtre de Chat */}
      {isOpen && (
        <div
          style={{
            width: '330px',
            height: '460px',
            backgroundColor: '#0f172a',
            color: '#fff',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
            border: '1px solid #334155',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #334155'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: '#22c55e',
                  borderRadius: '50%',
                  display: 'inline-block'
                }}
              />

              <span
                style={{
                  fontWeight: '600',
                  fontSize: '13px'
                }}
              >
                Assistant IA Salwa
              </span>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: '12px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '13px'
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf:
                    message.role === 'user'
                      ? 'flex-end'
                      : 'flex-start',
                  maxWidth: '85%'
                }}
              >
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: '12px',
                    backgroundColor:
                      message.role === 'user'
                        ? '#0891b2'
                        : '#1e293b',
                    color: '#fff',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere'
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: '11px',
                  fontStyle: 'italic'
                }}
              >
                L'assistant réfléchit...
              </div>
            )}
          </div>

          {/* Questions rapides */}
          <div
            style={{
              padding: '6px 10px',
              backgroundColor: '#0f172a',
              display: 'flex',
              gap: '6px',
              borderTop: '1px solid #1e293b'
            }}
          >
            {quickQuestions.map((question) => (
              <button
                key={question}
                disabled={loading}
                onClick={() =>
                  handleSend(
                    question === 'Contact'
                      ? "Comment contacter Salwa ?"
                      : `Parle-moi des ${question.toLowerCase()} de Salwa.`
                  )
                }
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  backgroundColor: '#1e293b',
                  color: '#cbd5e1',
                  border: '1px solid #334155',
                  cursor: loading ? 'not-allowed' : 'pointer'
                }}
              >
                {question}
              </button>
            ))}
          </div>

          {/* Champ de saisie */}
          <div
            style={{
              padding: '10px',
              backgroundColor: '#1e293b',
              display: 'flex',
              gap: '8px',
              borderTop: '1px solid #334155'
            }}
          >
            <input
              type="text"
              value={input}
              disabled={loading}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) =>
                event.key === 'Enter' && handleSend()
              }
              placeholder="Posez une question..."
              style={{
                flex: 1,
                minWidth: 0,
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #334155',
                backgroundColor: '#0f172a',
                color: '#fff',
                fontSize: '12px',
                outline: 'none'
              }}
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              style={{
                padding: '8px 14px',
                backgroundColor: '#06b6d4',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '12px',
                opacity: loading || !input.trim() ? 0.6 : 1
              }}
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

  