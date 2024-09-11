-- --------------- Create Tables ----------------

CREATE TABLE `sizes` (
  `id` integer PRIMARY KEY,
  `name` TEXT UNIQUE NOT NULL,
  `rows` integer NOT NULL,
  `columns` integer NOT NULL,
  `total_seat` integer NOT NULL
);

CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `email` TEXT UNIQUE NOT NULL,
  `hash_pswd` TEXT NOT NULL,
  `salt` TEXT NOT NULL,
  `is_loyal` BOOLEAN DEFAULT 0
);

CREATE TABLE `concerts` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `name` TEXT NOT NULL,
  `datetime` datetime NOT NULL,
  `description` TEXT NOT NULL,
  `theater_id` integer NOT NULL,
  FOREIGN KEY (`theater_id`) REFERENCES `theaters` (`id`)
);

CREATE TABLE `theaters` (
  `id` integer PRIMARY KEY,
  `name` TEXT NOT NULL,
  `size_id` integer NOT NULL,
  FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`)
);

CREATE TABLE `orders` (
  `id` integer PRIMARY KEY AUTOINCREMENT,
  `user_id` integer NOT NULL,
  `concert_id` integer NOT NULL,
  `seats` TEXT NOT NULL,
  `deleted_at` datetime,
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`concert_id`) REFERENCES `concerts` (`id`)
);

-- --------------- Insert Data ----------------

INSERT INTO `sizes` (`name`, `rows`, `columns`, `total_seat`) VALUES 
('small', 5, 5, 25),
('medium', 10, 10, 100),
('large', 15, 15, 225);

INSERT INTO `theaters` (`name`, `size_id`) VALUES 
('Tokio Dome', 1),
('Madison Square Garden', 2),
('Royal Albert Hall', 3);

INSERT INTO `concerts` (`name`, `datetime`, `description`, `theater_id`) VALUES 
('Sabaton Event', '2025-12-01 20:00', ' The War to End All Wars - Tour', 1),
('Gojira Reunion', '2024-12-02 20:00', ' From Mars to Sirius - Tour', 2),
('BTS in USA', '2025-11-03 20:00', ' Love Yourself - Tour', 3),
('The Weeknd', '2024-11-04 20:00', ' After Hours - Tour', 1),
('Metallica', '2024-10-06 20:00', ' WorldWired - Tour', 3),
('Queen', '2023-11-07 20:00', ' The Works - Tour', 1);

INSERT into `users` (`email`, `hash_pswd`, `salt`, `is_loyal`) VALUES  
('mario@nintendo.com', '9dd88a9d2da2af5d76a62dc3ed812089f9b25969a9e747e6692a551524da24f70c6d1e8e483bdff4865113797381414d0d97b49bba2d7e67b89f6a61f82bf51d', 'MpjYHtuoyiuqGHjb', 0),
('luigi@nintendo.com', '0074450cce92724acd4e3e82159bc4ec7517c62f233c9f5d93d081fc81e16ede56f3526337db5afd7e6c36a9bb28a661ac135900e8fe31190135588ae228b74f', 'hRTVsmuSyivnfWFN', 1),
('link@nintendo.com', '451a28b5e4a82bc706e91de22912208e06faabe2cfb04414587647f41e941ff62211894c9e98e2943bbabd5dddbe418d17d77911e6bdb074c4f25eda4cbf2aba', 'iIbMkWlmYMEMHiGV', 0),
('kojima@kojima.com', '0efbc21799152e67687a412660643b98e2c218406ecf9d3d0cb49c83e9e723804bf587002d74fa4653cfe8546e8758999fd6a67b03fe32b7d19e111096353001', 'iTcLPIGdjeSvWMTA', 1),
('miyazaki@soul.com', 'a2601ae79e6cb7a734f959c639fa8c0164e43ce92f25435fc0f5ee663527da8d63cbaae009ac4d7e6c78708a5208d958336f8f65396602f02894d68904ac119d', 'aclMKHaYuZZPoosN', 0),
('the-last@ofus.com', 'b86326eb284065535692ef1be88aebf9ef147620cfaf3c90053b6c28140ab215a7231b134246e7bac69ffd7782a8be457fb4e9b03456249514828715ad58d8ae', 'nkLYzwcpmjmtYigP', 1);

INSERT INTO `orders` (`user_id`, `concert_id`, `seats`) VALUES 
(1, 1, '{"id":[ 1,3,5]}'), 
(1, 2, '{"id":[ 2,4,6]}'),
(2, 3, '{"id":[ 7,8,9]}'),
(2, 1, '{"id":[ 10,11,12]}'),
(3, 3, '{"id":[ 1,2,3]}'),
(3, 5, '{"id":[ 4,5,6]}'),
(4, 4, '{"id":[ 7,8,9]}'),
(4, 6, '{"id":[ 10,11,12]}');

INSERT INTO `orders` (`user_id`, `concert_id`, `seats`, `deleted_at`) VALUES 
(4, 2, '{"id":[ 10,11,12]}', '2024-08-04 20:00');