import express from './config/express';

const port = process.env.PORT || 3000;

express.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }

  return console.log(`server is listening on ${port}`);
});
