CREATE TABLE `sizes` (
  `name` TEXT PRIMARY KEY,
  `rows` integer NOT NULL,
  `columns` integer NOT NULL
);

CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `username` TEXT UNIQUE NOT NULL,
  `email` TEXT NOT NULL,
  `passw` TEXT NOT NULL,
  `salt` TEXT NOT NULL,
  `is_loyal` BOOLEAN DEFAULT 0
);

CREATE TABLE `concerts` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `date` TEXT NOT NULL,
  `time` TEXT NOT NULL,
  `theater_id` integer NOT NULL REFERENCES `theaters`(`id`)
);

CREATE TABLE `theaters` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `size` TEXT NOT NULL REFERENCES `sizes`(`name`)
);

CREATE TABLE `booked_seats` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `user_id` integer NOT NULL REFERENCES `users`(`id`),
  `concert_id` integer NOT NULL REFERENCES `concerts`(`id`),
  `row_num` integer NOT NULL,
  `column_num` integer NOT NULL 
);


-- Insert sample data
INSERT INTO `sizes` (`name`, `rows`, `columns`) VALUES
('Small', 10, 10),
('Medium', 20, 20),
('Large', 30, 30);

INSERT INTO `theaters` (`name`, `size`) VALUES
('Theater A', 'Small'),
('Theater B', 'Medium'),
('Theater C', 'Large');

INSERT INTO `concerts` (`name`, `date`, `time`, `theater_id`) VALUES
('Concert A', '2023-10-01', '19:00', 1),
('Concert B', '2023-10-02', '20:00', 2),
('Concert C', '2023-10-03', '21:00', 3),
('Concert D', '2023-10-04', '19:00', 1),
('Concert E', '2023-10-05', '20:00', 2),
('Concert F', '2023-10-06', '21:00', 3);

INSERT INTO `users` (`username`, `email`, `passw`, `salt`, `is_loyal`) VALUES
('user1', 'user1@example.com', 'password1', 'salt1', 1),
('user2', 'user2@example.com', 'password2', 'salt2', 0),
('user3', 'user3@example.com', 'password3', 'salt3', 1),
('user4', 'user4@example.com', 'password4', 'salt4', 0),
('user5', 'user5@example.com', 'password5', 'salt5', 1),
('user6', 'user6@example.com', 'password6', 'salt6', 0);

INSERT INTO `booked_seats` (`user_id`, `concert_id`, `row_num`, `column_num`) VALUES
(1, 1, 1, 1),
(1, 2, 2, 2),
(2, 3, 3, 3),
(3, 4, 4, 4),
(4, 5, 5, 5);