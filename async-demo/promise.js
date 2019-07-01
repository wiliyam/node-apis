const p = new Promise((res, rej) => {
  setTimeout(() => {
    rej(new Error("error"));
  }, 2000);
});

console.log(
  p
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err.message);
    })
);
