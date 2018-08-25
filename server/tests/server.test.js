const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Show} = require('./../models/show');
const {InventoryItem} = require('./../models/inventoryitem');

// Initialize the shows database and the inventory database as empty
beforeEach((done) => {
  Show.remove({}).then(() => {
    InventoryItem.remove({}).then(() => done());
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
        // Should be the only show in the inventory
        InventoryItem.find().then((shows) => {
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
            // Should still be only one show in the inventory
            InventoryItem.find().then((shows) => {
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
