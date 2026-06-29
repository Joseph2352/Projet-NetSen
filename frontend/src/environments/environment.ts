// Configuration de production. apiUrl reste relatif ('/api') : c'est
// frontend/vercel.json qui redirige ces requêtes vers l'API Render.
export const environment = {
  production: true,
  apiUrl: '/api',
};
