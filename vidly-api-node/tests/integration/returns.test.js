const { Rental } = require("../../models/rental");
const mongoose = require("mongoose");

describe("/api/returns", () => {
  let server;
  let customerId;
  beforeEach(() => {
    server = require("../../../index");
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    const rental = new Rental({
      customer: { _id: customerId, name: "wiliyam", phone: "2312342423432" },
      movie: { _id: movieId, title: "sxsxxwxw", dailyRentalRate: 2 }
    });
  });
  afterEach(async () => {
    await server.close();
    await Genre.deleteMany({});
  });
  afterAll(async () => {
    server.close();
    await Rental.deleteMany({});
  });

  it("should works", () => {});
});
