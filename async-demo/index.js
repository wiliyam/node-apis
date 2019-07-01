console.log("Before..");
display();
console.log("After...");

async function display(customer) {
  try {
    let customer = await getCustomer(1);
    console.log("Customer: ", customer);
    if (customer.isGold) {
      let movie = await getTopMovies("movie");
      console.log("Top movies: ", movie);
      let email = await sendEmail("abc@gbcjc.com", movie);
      console.log("Email sent...");
    }
  } catch (error) {
    console.log(error);
  }
}

function getCustomer(id) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({
        id: 1,
        name: "Mosh Hamedani",
        isGold: true,
        email: "email"
      });
    }, 4000);
  });
}
function getTopMovies() {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(["movie1", "movie2"]);
    }, 4000);
  });
}

function sendEmail(email, movies) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res("Email sent...");
    }, 4000);
  });
}
