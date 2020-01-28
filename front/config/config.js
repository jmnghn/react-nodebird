const { backUrl } = process.env.NODE_ENV === 'production' ? 'http://api.jngmnghn.com' : 'http://localhost:3065';
cosnoel.log('backUrl', backUrl);
export { backUrl };
