-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 02, 2026 at 11:07 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nutritionai`
--

-- --------------------------------------------------------

--
-- Table structure for table `health_profiles`
--

CREATE TABLE `health_profiles` (
  `user_id` int(11) NOT NULL,
  `age` int(11) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `height_cm` float DEFAULT NULL,
  `weight_kg` float DEFAULT NULL,
  `activity_level` varchar(50) DEFAULT NULL,
  `sleep_hours` double DEFAULT 7.5,
  `stress_level` varchar(50) DEFAULT 'Medium'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `health_profiles`
--

INSERT INTO `health_profiles` (`user_id`, `age`, `gender`, `height_cm`, `weight_kg`, `activity_level`, `sleep_hours`, `stress_level`) VALUES
(1, 22, 'Male', 175, 70, 'Moderate', 7.5, 'Medium'),
(6, 28, 'MALE', 172, 68, 'Sedentary', 8, 'Low'),
(9, 20, 'MALE', 175, 72, 'MODERATE', 7.5, 'Medium'),
(10, 22, 'MALE', 170, 70, 'MODERATE', 7.62404203414917, 'Medium'),
(11, 21, 'Male', 175, 65, 'Lightly Active', 7, 'Medium'),
(12, 21, 'Male', 165, 56, 'Lightly Active', 7, 'Medium');

-- --------------------------------------------------------

--
-- Table structure for table `medical_conditions`
--

CREATE TABLE `medical_conditions` (
  `id` int(11) NOT NULL,
  `condition_name` varchar(100) DEFAULT NULL,
  `max_sugar` float DEFAULT NULL,
  `max_sodium` float DEFAULT NULL,
  `max_fat` float DEFAULT NULL,
  `max_carbs` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medical_conditions`
--

INSERT INTO `medical_conditions` (`id`, `condition_name`, `max_sugar`, `max_sodium`, `max_fat`, `max_carbs`) VALUES
(1, 'Diabetes', 25, NULL, NULL, 60),
(2, 'Hypertension', NULL, 1500, NULL, NULL),
(3, 'Heart Disease', NULL, NULL, 65, NULL),
(4, 'Kidney Disease', NULL, 1500, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scan_history`
--

CREATE TABLE `scan_history` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `barcode` varchar(255) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `analysis_result` varchar(50) DEFAULT NULL,
  `ai_prediction` varchar(50) DEFAULT NULL,
  `raw_ocr_text` text DEFAULT NULL,
  `ai_analysis_result` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ai_analysis_result`)),
  `scanned_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scan_history`
--

INSERT INTO `scan_history` (`id`, `user_id`, `barcode`, `image_url`, `product_name`, `analysis_result`, `ai_prediction`, `raw_ocr_text`, `ai_analysis_result`, `scanned_at`) VALUES
(1, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/106/316/2464/front_en.10.400.jpg', 'BRITANNIA marie GOLD', 'SAFE', 'SAFE', NULL, NULL, '2026-03-19 14:08:38'),
(2, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/106/316/2464/front_en.10.400.jpg', 'BRITANNIA marie GOLD', 'SAFE', 'SAFE', NULL, NULL, '2026-03-19 14:11:19'),
(3, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/106/316/2464/front_en.10.400.jpg', 'BRITANNIA marie GOLD', 'SAFE', 'Safe', NULL, NULL, '2026-03-19 14:11:24'),
(4, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/106/316/2464/front_en.10.400.jpg', 'BRITANNIA marie GOLD', 'SAFE', 'Safe', NULL, NULL, '2026-03-19 14:12:05'),
(5, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/106/316/2464/front_en.10.400.jpg', 'BRITANNIA marie GOLD', 'SAFE', 'Safe', NULL, NULL, '2026-03-19 14:12:14'),
(6, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/106/316/2464/front_en.10.400.jpg', 'BRITANNIA marie GOLD', 'SAFE', 'Safe', NULL, NULL, '2026-03-19 14:12:22'),
(7, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/106/316/2464/front_en.10.400.jpg', 'BRITANNIA marie GOLD', 'SAFE', 'Safe', NULL, NULL, '2026-03-19 14:12:51'),
(8, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/106/316/2464/front_en.10.400.jpg', 'BRITANNIA marie GOLD', 'SAFE', 'Safe', NULL, NULL, '2026-03-19 14:13:01'),
(9, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/910/604/2216/front_en.4.400.jpg', 'Horlicks milkshake', 'SAFE', 'Safe', NULL, NULL, '2026-03-19 14:13:13'),
(10, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/103/098/6321/front_en.7.400.jpg', 'Unknown Product', 'SAFE', 'SAFE', NULL, NULL, '2026-03-19 14:23:22'),
(11, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/103/098/6321/front_en.7.400.jpg', 'Unknown Product', 'SAFE', 'Safe', NULL, NULL, '2026-03-19 14:24:36'),
(12, 6, NULL, 'https://images.openfoodfacts.org/images/products/600/106/560/1243/front_en.18.400.jpg', 'Dairy Milk Silk Chocolate', 'HIGH SUGAR', 'Safe', NULL, NULL, '2026-03-19 14:24:43'),
(13, 6, NULL, 'https://images.openfoodfacts.org/images/products/600/106/560/1243/front_en.18.400.jpg', 'Dairy Milk Silk Chocolate', 'HIGH SUGAR', 'Avoid', NULL, NULL, '2026-03-19 14:25:06'),
(14, 6, NULL, 'https://images.openfoodfacts.org/images/products/600/106/560/1243/front_en.18.400.jpg', 'Dairy Milk Silk Chocolate', 'HIGH SUGAR', 'Avoid', NULL, NULL, '2026-03-19 14:25:11'),
(15, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/157/100/0036/front_fr.3.400.jpg', 'Horlicks - chocolate delight flavour', 'HIGH SODIUM', 'SAFE', NULL, NULL, '2026-03-19 16:38:09'),
(16, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/611/736/0360/front_en.5.400.jpg', 'Country Delight Cow Milk', 'SAFE', 'SAFE', NULL, NULL, '2026-03-19 16:39:30'),
(17, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/611/736/0360/front_en.5.400.jpg', 'Country Delight Cow Milk', 'SAFE', 'SAFE', NULL, NULL, '2026-03-19 16:41:49'),
(18, 6, NULL, 'https://images.openfoodfacts.org/images/products/068/544/100/0286/front_en.3.400.jpg', 'Peanut Chikki', 'HIGH SUGAR', 'SAFE', NULL, NULL, '2026-03-19 16:43:17'),
(19, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/446/310/0241/front_en.11.400.jpg', 'Wellcore Creatine Monohydrate', 'SAFE', 'SAFE', NULL, NULL, '2026-03-19 16:47:12'),
(20, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/172/511/8914/front_en.3.400.jpg', 'Tedhe Medhe', 'SAFE', 'SAFE', NULL, NULL, '2026-03-19 16:58:32'),
(21, 6, NULL, '', 'Bingo', 'SAFE', 'SAFE', NULL, NULL, '2026-03-19 16:59:42'),
(22, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/112/300/1214/front_en.22.400.jpg', 'Lotte Choco Pie', 'HIGH SUGAR', 'SAFE', NULL, NULL, '2026-03-19 17:11:58'),
(23, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/157/100/0036/front_fr.3.400.jpg', 'Horlicks - chocolate delight flavour', 'HIGH SODIUM', 'SAFE', NULL, NULL, '2026-03-19 17:18:15'),
(24, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/157/100/0036/front_fr.3.400.jpg', 'Horlicks - chocolate delight flavour', 'HIGH SODIUM', 'Moderate', NULL, NULL, '2026-03-19 17:40:05'),
(25, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/157/100/0036/front_fr.3.400.jpg', 'Horlicks - chocolate delight flavour', 'HIGH SODIUM', 'SAFE', NULL, NULL, '2026-03-19 17:40:23'),
(26, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/157/100/0036/front_fr.3.400.jpg', 'Horlicks - chocolate delight flavour', 'HIGH SODIUM', 'Moderate', NULL, NULL, '2026-03-19 17:41:52'),
(27, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/157/100/0036/front_fr.3.400.jpg', 'Horlicks - chocolate delight flavour', 'HIGH SODIUM', 'Moderate', NULL, NULL, '2026-03-19 17:42:18'),
(28, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/103/097/6094/front_en.3.400.jpg', 'Horlicks', 'SAFE', 'Safe', NULL, NULL, '2026-03-19 17:42:38'),
(29, 6, NULL, 'https://images.openfoodfacts.org/images/products/890/103/089/7542/front_en.22.400.jpg', 'kissan fresh tomato', 'SAFE', 'Moderate', NULL, NULL, '2026-03-19 17:45:29'),
(30, 6, '8939111430234', 'https://images.openfoodfacts.org/images/products/893/911/143/0234/front_en.3.400.jpg', 'Creatine', 'SAFE', 'SAFE', NULL, NULL, '2026-03-19 18:55:21'),
(31, 6, '8901123001214', 'https://images.openfoodfacts.org/images/products/890/112/300/1214/front_en.22.400.jpg', 'Lotte Choco Pie', 'HIGH SUGAR', 'SAFE', NULL, NULL, '2026-03-19 19:08:27'),
(32, 9, '716270001660', 'https://images.openfoodfacts.org/images/products/071/627/000/1660/front_en.41.400.jpg', 'Ginger Crystallized In Dark Chocolate', 'HIGH SUGAR', 'SAFE', NULL, NULL, '2026-03-20 03:07:29'),
(33, 9, '8901123001214', 'https://images.openfoodfacts.org/images/products/890/112/300/1214/front_en.22.400.jpg', 'Lotte Choco Pie', 'HIGH SUGAR', 'Moderate', NULL, NULL, '2026-03-20 03:17:35'),
(34, 9, '8904335605522', '', 'High Protein Oats', 'SAFE', 'Safe', NULL, NULL, '2026-03-20 03:18:37'),
(35, 9, '8904057395770', 'https://images.openfoodfacts.org/images/products/890/405/739/5770/front_en.3.400.jpg', 'Full Cream Milk', 'SAFE', 'SAFE', NULL, NULL, '2026-03-20 03:19:51'),
(36, 9, '8901491103800', 'https://images.openfoodfacts.org/images/products/890/149/110/3800/front_en.4.400.jpg', 'Oats', 'SAFE', 'SAFE', NULL, NULL, '2026-03-20 03:22:18'),
(37, 9, '078742355016', '', 'Original potato chips', 'SAFE', 'SAFE', NULL, NULL, '2026-03-20 03:28:47'),
(38, 9, '8901725007508', 'https://images.openfoodfacts.org/images/products/890/172/500/7508/front_en.3.400.jpg', 'Bingo! Potato Chips Chilli Sprinkled', 'SAFE', 'Moderate', NULL, NULL, '2026-03-20 03:30:25'),
(39, 9, '050000696598', 'https://images.openfoodfacts.org/images/products/005/000/069/6598/front_en.4.400.jpg', 'Vanilla chocolate chip cookie frozen dairy dessert sandwiches', 'HIGH SUGAR', 'SAFE', NULL, NULL, '2026-03-20 03:47:21'),
(40, 9, '7622210063465', '', 'Cadbury dairy milk', 'SAFE', 'SAFE', NULL, NULL, '2026-03-20 03:49:20'),
(41, 9, '7622210063465', '', 'Cadbury dairy milk', 'SAFE', 'SAFE', NULL, NULL, '2026-03-20 05:50:51'),
(42, 11, '8909081005046', 'https://images.openfoodfacts.org/images/products/890/908/100/5046/front_en.14.400.jpg', 'Dark Fantasy Choco Fills', 'HIGH SUGAR', 'Moderate', NULL, NULL, '2026-05-02 03:29:05'),
(43, 11, '8909081005046', 'https://images.openfoodfacts.org/images/products/890/908/100/5046/front_en.14.400.jpg', 'Dark Fantasy Choco Fills', 'HIGH SUGAR', 'Moderate', NULL, NULL, '2026-05-02 03:29:05'),
(44, 11, '7622201758660', 'https://images.openfoodfacts.org/images/products/762/220/175/8660/front_en.7.400.jpg', 'Perk Double', 'HIGH SUGAR', 'Moderate', NULL, NULL, '2026-05-02 03:31:02'),
(45, 11, '7622201758660', 'https://images.openfoodfacts.org/images/products/762/220/175/8660/front_en.7.400.jpg', 'Perk Double', 'HIGH SUGAR', 'Moderate', NULL, NULL, '2026-05-02 03:31:02'),
(46, 1, '5449000000996', '', 'Coca-Cola', 'SAFE', 'Safe', NULL, NULL, '2026-05-02 03:36:07'),
(47, 11, '8901719101038', 'https://images.openfoodfacts.org/images/products/890/171/910/1038/front_en.20.400.jpg', 'Parle - G', 'SAFE', 'Avoid', NULL, NULL, '2026-05-02 03:37:08'),
(48, 11, '8901719101038', 'https://images.openfoodfacts.org/images/products/890/171/910/1038/front_en.20.400.jpg', 'Parle - G', 'SAFE', 'Avoid', NULL, NULL, '2026-05-02 03:37:09'),
(49, 12, '8901719101038', 'https://images.openfoodfacts.org/images/products/890/171/910/1038/front_en.20.400.jpg', 'Parle - G', 'SAFE', 'Avoid', NULL, NULL, '2026-05-02 07:38:13'),
(50, 12, '8901719101038', 'https://images.openfoodfacts.org/images/products/890/171/910/1038/front_en.20.400.jpg', 'Parle - G', 'SAFE', 'Avoid', NULL, NULL, '2026-05-02 07:38:13'),
(51, 12, '8906010301927', 'https://images.openfoodfacts.org/images/products/890/601/030/1927/front_en.3.400.jpg', 'Unknown Product', 'SAFE', 'Safe', NULL, NULL, '2026-05-02 07:40:11'),
(52, 12, '8906010301927', 'https://images.openfoodfacts.org/images/products/890/601/030/1927/front_en.3.400.jpg', 'Unknown Product', 'SAFE', 'Safe', NULL, NULL, '2026-05-02 07:40:11'),
(53, 12, '6001065601243', 'https://images.openfoodfacts.org/images/products/600/106/560/1243/front_en.18.400.jpg', 'Dairy Milk Silk Chocolate', 'HIGH SUGAR', 'Avoid', NULL, NULL, '2026-05-02 07:41:53'),
(54, 12, '6001065601243', 'https://images.openfoodfacts.org/images/products/600/106/560/1243/front_en.18.400.jpg', 'Dairy Milk Silk Chocolate', 'HIGH SUGAR', 'Avoid', NULL, NULL, '2026-05-02 07:41:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `profile_image` varchar(255) DEFAULT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `email`, `password_hash`, `created_at`, `profile_image`, `profile_image_url`) VALUES
(1, 'Dinesh', 'dinesh@gmail.com', '123', '2026-03-15 13:00:10', NULL, NULL),
(3, 'mahesh', 'mahesh@gmail.com', '123', '2026-03-15 13:01:12', NULL, NULL),
(4, 'sai', 'sai@gmail.com', '123456', '2026-03-15 17:34:50', NULL, NULL),
(5, 'sai', 'appanagirisai7569@gmail.com', '123456', '2026-03-15 17:44:21', NULL, NULL),
(6, 'dinesh', 'shiva@gmail.com', 'shiva123', '2026-03-19 12:40:25', NULL, NULL),
(7, 'shiva@gmail.com', 'shiva1234', '', '2026-03-19 14:09:13', NULL, NULL),
(9, 'Charan', 'charan123@gmail.com', 'charan123', '2026-03-20 03:05:47', NULL, 'http://10.136.116.54:5000/uploads/profiles\\profile_9.jpg'),
(10, 'charan', 'charandevalapalli@gmail.com', 'charan123', '2026-05-01 18:05:41', NULL, NULL),
(11, 'Vishnu', 'Vishnu@gmail.com', 'Vishnu123', '2026-05-02 03:07:47', NULL, NULL),
(12, 'Dinesh', 'mandlidinesh1432@gmail.com', 'dinesh123', '2026-05-02 03:38:58', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_conditions`
--

CREATE TABLE `user_conditions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `disease_name` varchar(100) DEFAULT NULL,
  `stage` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_conditions`
--

INSERT INTO `user_conditions` (`id`, `user_id`, `disease_name`, `stage`) VALUES
(1, 6, 'Diabetes', 'Stage 1'),
(2, 6, 'Hypertension', 'Stage 2'),
(3, 6, 'Diabetes', 'Stage 2');

-- --------------------------------------------------------

--
-- Table structure for table `user_medical_conditions`
--

CREATE TABLE `user_medical_conditions` (
  `user_id` int(11) NOT NULL,
  `condition_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_medical_conditions`
--

INSERT INTO `user_medical_conditions` (`user_id`, `condition_id`) VALUES
(1, 1),
(6, 1),
(6, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user_nutritional_limits`
--

CREATE TABLE `user_nutritional_limits` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `condition_name` varchar(100) DEFAULT NULL,
  `stage` varchar(50) DEFAULT NULL,
  `max_calories` float DEFAULT NULL,
  `max_sugar` float DEFAULT NULL,
  `max_carbs` float DEFAULT NULL,
  `max_fat` float DEFAULT NULL,
  `max_saturated_fat` float DEFAULT NULL,
  `max_trans_fat` float DEFAULT NULL,
  `max_sodium` float DEFAULT NULL,
  `max_cholesterol` float DEFAULT NULL,
  `min_fiber` float DEFAULT NULL,
  `min_protein` float DEFAULT NULL,
  `max_potassium` float DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_nutritional_limits`
--

INSERT INTO `user_nutritional_limits` (`id`, `user_id`, `condition_name`, `stage`, `max_calories`, `max_sugar`, `max_carbs`, `max_fat`, `max_saturated_fat`, `max_trans_fat`, `max_sodium`, `max_cholesterol`, `min_fiber`, `min_protein`, `max_potassium`, `created_at`) VALUES
(1, 1, NULL, NULL, NULL, 25, 300, 60, NULL, NULL, 1500, NULL, NULL, NULL, NULL, '2026-03-15 13:10:13'),
(2, 6, NULL, NULL, NULL, 30, 272, 68, NULL, NULL, 2300, NULL, NULL, NULL, NULL, '2026-03-19 12:40:54'),
(3, 6, NULL, NULL, NULL, 30, 280, 70, NULL, NULL, 2300, NULL, NULL, NULL, NULL, '2026-03-19 19:25:21'),
(4, 6, NULL, NULL, NULL, 30, 280, 70, NULL, NULL, 2300, NULL, NULL, NULL, NULL, '2026-03-19 19:26:23'),
(5, 6, NULL, NULL, NULL, 30, 280, 70, NULL, NULL, 2300, NULL, NULL, NULL, NULL, '2026-03-19 19:26:37'),
(6, 6, NULL, NULL, NULL, 30, 280, 70, NULL, NULL, 2300, NULL, NULL, NULL, NULL, '2026-03-19 22:43:36'),
(7, 6, NULL, NULL, NULL, 30, 280, 70, NULL, NULL, 2300, NULL, NULL, NULL, NULL, '2026-03-19 22:44:13'),
(8, 6, NULL, NULL, NULL, 30, 280, 70, NULL, NULL, 2300, NULL, NULL, NULL, NULL, '2026-03-19 22:47:53'),
(9, 9, NULL, NULL, NULL, 30, 288, 72, NULL, NULL, 2300, NULL, NULL, NULL, NULL, '2026-03-20 03:06:42'),
(10, 10, NULL, NULL, NULL, 30, 280, 70, NULL, NULL, 2300, NULL, NULL, NULL, NULL, '2026-05-01 18:06:57'),
(11, 11, NULL, NULL, NULL, 35, 300, 70, NULL, NULL, 2300, NULL, NULL, NULL, NULL, '2026-05-02 03:12:44'),
(12, 12, NULL, NULL, NULL, 35, 300, 70, NULL, NULL, 2300, NULL, NULL, NULL, NULL, '2026-05-02 03:39:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `health_profiles`
--
ALTER TABLE `health_profiles`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `medical_conditions`
--
ALTER TABLE `medical_conditions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scan_history`
--
ALTER TABLE `scan_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_conditions`
--
ALTER TABLE `user_conditions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_medical_conditions`
--
ALTER TABLE `user_medical_conditions`
  ADD PRIMARY KEY (`user_id`,`condition_id`),
  ADD KEY `condition_id` (`condition_id`);

--
-- Indexes for table `user_nutritional_limits`
--
ALTER TABLE `user_nutritional_limits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `medical_conditions`
--
ALTER TABLE `medical_conditions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `scan_history`
--
ALTER TABLE `scan_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `user_conditions`
--
ALTER TABLE `user_conditions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_nutritional_limits`
--
ALTER TABLE `user_nutritional_limits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `health_profiles`
--
ALTER TABLE `health_profiles`
  ADD CONSTRAINT `health_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `scan_history`
--
ALTER TABLE `scan_history`
  ADD CONSTRAINT `scan_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_conditions`
--
ALTER TABLE `user_conditions`
  ADD CONSTRAINT `user_conditions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_medical_conditions`
--
ALTER TABLE `user_medical_conditions`
  ADD CONSTRAINT `user_medical_conditions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_medical_conditions_ibfk_2` FOREIGN KEY (`condition_id`) REFERENCES `medical_conditions` (`id`);

--
-- Constraints for table `user_nutritional_limits`
--
ALTER TABLE `user_nutritional_limits`
  ADD CONSTRAINT `user_nutritional_limits_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
