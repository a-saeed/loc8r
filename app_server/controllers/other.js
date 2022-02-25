
/**GET 'about' page */
export const about = (req, res, next) => {
  res.render('generic_text', { title: 'About' });
}