const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Show} = require('./../models/show');
const {InventoryItem} = require('./../models/inventoryitem');

const inventory = [{
  title: "CATS",
  startDate: "2017-06-01",
  genre: "MUSICAL",
},{
  title: "COMEDY OF ERRORS",
  startDate: "2017-07-01",
  genre: "COMEDY"
},{
  title: "EVERYMAN",
  startDate: "2017-08-01",
  genre: "DRAMA"
},{
  title: "BATMAN",
  startDate: "2017-09-01",
  genre: "DRAMA"
}]

// Initialize the shows database as empty
// Initializes the inventory database with 4 entries
beforeEach((done) => {
  Show.remove({}).then(() => {
    InventoryItem.remove({}).then(() => {
      return InventoryItem.insertMany(inventory);
    }).then(() => done());
  });
});

describe('POST /allshows', () => {
  it('should add all shows to the inventory', (done) => {
    request(app)
      .post('/allshows')
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // Should contain 121 shows
        Show.find().then((shows) => {
          expect(shows.length).toBe(121);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not add a duplicate of the shows to the inventory', (done) => {
    // Post the first time should succeed
    request(app)
    .post('/allshows')
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      // Post the second time should fail
      request(app)
        .post('/allshows')
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          // Should still have 121 shows
          Show.find().then((shows) => {
            expect(shows.length).toBe(121);
            done();
          }).catch((err) => done(err));
        });
      });
  });
});

describe('POST /inventory', () => {
  it('should add a show to the inventory', (done) => {
    const title = "1984";
  	const startDate = "2017-10-14";
  	const genre = "DRAMA";

    request(app)
      .post('/inventory')
      .send({title, startDate, genre})
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(title);
        expect(res.body.startDate).toBe(startDate);
        expect(res.body.genre).toBe(genre);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // Should be the only show in the inventory with the title '1984'
        InventoryItem.find({title}).then((shows) => {
          expect(shows.length).toBe(1);
          expect(shows[0].title).toBe(title);
          expect(shows[0].startDate).toBe(startDate);
          expect(shows[0].genre).toBe(genre);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not add a duplicate show to the inventory', (done) => {
    const title = "1984";
  	const startDate = "2017-10-14";
  	const genre = "DRAMA";

    // Post the first time should succeed
    request(app)
      .post('/inventory')
      .send({title, startDate, genre})
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        // Post the second time should fail
        request(app)
          .post('/inventory')
          .send({title, startDate, genre})
          .expect(400)
          .end((err, res) => {
            if (err) {
              return done(err);
            }
            // Should be only show in the inventory with the title '1984'
            InventoryItem.find({title}).then((shows) => {
              expect(shows.length).toBe(1);
              expect(shows[0].title).toBe(title);
              expect(shows[0].startDate).toBe(startDate);
              expect(shows[0].genre).toBe(genre);
              done();
            }).catch((err) => done(err));
          });
      });
  });
});

describe('GET /inventory', () => {
  it('should get all shows from the inventory', (done) => {
    request(app)
      .get('/inventory')
      .expect(200)
      .expect((res) => expect(res.body.shows.length).toBe(4))
      .end(done);
  });

  it('should get return 2 genres', (done) => {
    request(app)
      .get('/inventory?queryDate=2017-01-01&showDate=2017-07-01')
      .expect(200)
      .expect((res) => expect(res.body.inventory.length).toBe(2))
      .end(done);
  });

  it('should get return 3 genres', (done) => {
    request(app)
      .get('/inventory?queryDate=2017-01-01&showDate=2017-08-01')
      .expect(200)
      .expect((res) => expect(res.body.inventory.length).toBe(3))
      .end(done);
  });

  it('should have status "Sale not started"', (done) => {
    request(app)
      .get('/inventory?queryDate=2017-01-01&showDate=2017-08-01')
      .expect(200)
      .expect((res) => expect(res.body.inventory[0].shows[0].status).toBe("Sale not started"))
      .end(done);
  });

  it('should have status "Open for sale"', (done) => {
    request(app)
      .get('/inventory?queryDate=2017-08-01&showDate=2017-08-15')
      .expect(200)
      .expect((res) => expect(res.body.inventory[0].shows[0].status).toBe("Open for sale"))
      .end(done);
  });

  it('should have status "In the past"', (done) => {
    request(app)
      .get('/inventory?queryDate=2017-08-02&showDate=2017-08-01')
      .expect(200)
      .expect((res) => expect(res.body.inventory[0].shows[0].status).toBe("In the past"))
      .end(done);
  });

  it('should have status "Sold out"', (done) => {
    request(app)
      .get('/inventory?queryDate=2017-08-01&showDate=2017-08-05')
      .expect(200)
      .expect((res) => expect(res.body.inventory[0].shows[0].status).toBe("Sold out"))
      .end(done);
  });
});
