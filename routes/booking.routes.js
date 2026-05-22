const router = require("express").Router();
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const bookingController = require("../controllers/booking.controller");

router.post("/", isAuthenticated, bookingController.createBooking);

router.get("/my-bookings", isAuthenticated, bookingController.getMyBookings);

router.get("/received", isAuthenticated, bookingController.getReceivedBookings);

router.put("/:id/status", isAuthenticated, bookingController.updateBookingStatus);

router.delete("/:id", isAuthenticated, bookingController.deleteBooking);

module.exports = router;