
/**GET 'about' page */
export const about = (req, res, next) => {
  res.render('index', { title: 'About' });
}