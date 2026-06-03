-- USERS
INSERT INTO users (first_name, last_name, email, phone, account_type)
VALUES 
('Tessa', 'Miller', 'thenestreno@gmail.com', '7752848841', 'business'),
('Samantha', 'Stremmel', 'hello@sierrawatergardens.com', '7753455806', 'business'),
('Stephanie', 'Cochrane', 'hello@thewastelessshop.com', '7752251045', 'business');

-- CATEGORIES
INSERT INTO categories (name, slug)
VALUES
('Clothing & Apparel', 'clothing-and-apparel'),
('Home Decor & Furniture', 'home-decor-and-furniture'),
('Gifts & Specialty', 'gifts-and-specialty'),
('Art & Design', 'art-and-design'),
('Jewelry & Accessories', 'jewelry-and-accessories'),
('Plants & Garden', 'plants-and-garden'),
('Sustainable Living', 'sustainable-living'),
('Beauty & Wellness', 'beauty-and-wellness');

-- BUSINESSES
INSERT INTO businesses (name, slug, description, address, city, state, zip, phone, email)
VALUES
('The Nest', 'the-nest', 'A vintage shop filled with unique, high-quality pieces carefully curated for their character, craftsmanship, and story. Inside you will find a constantly evolving mix of vintage clothing, mid-century furniture, art, oddities, gifts, and the kinds of objects that make a home or outfit feel personal.', '201 Keystone Ave', 'Reno', 'NV', '89503', '7752848841', 'thenestreno@gmail.com'),
('Sierra Water Gardens', 'sierra-water-gardens', 'A small locally owned business in Reno, NV located on Dickerson Road. An indoor warehouse retail space selling all types and sizes of succulents, airplants, indoor plants, and gifts.', '2055 Dickerson Rd', 'Reno', 'NV', '89503', '7753455806', 'hello@sierrawatergardens.com'),
('The Waste Less Shop', 'the-waste-less-shop', 'A thoughtfully curated refill shop focused on clean, non-toxic living. Offering sustainable everyday essentials, refillable products, and locally sourced goods that make intentional living feel easy and elevated.', '7300 Rancharrah Pkwy Ste 120', 'Reno', 'NV', '89511', '7752251045', 'hello@thewastelessshop.com');

-- SERVICES (The Nest - business_id = 1)
INSERT INTO services (business_id, category_id, name, description)
VALUES
(7, 1, 'Vintage Clothing', 'Curated vintage tees, denim jackets, leather jackets, dresses, sweaters, and outerwear'),
(7, 2, 'Vintage Furniture', 'Mid-century chairs, tables, dressers, shelving, and decorative objects'),
(7, 2, 'Lighting', 'Table lamps, floor lamps, and unique vintage light fixtures'),
(7, 2, 'Wall Art & Mirrors', 'Framed art, prints, and vintage mirrors'),
(7, 5, 'Jewelry & Accessories', 'Gold and silver jewelry, statement pieces, belts, sunglasses, and handbags'),
(7, 3, 'Unique Gifts', 'One-of-a-kind curated gifts, ceramics, pottery, candles, and home goods'),

-- SERVICES (Sierra Water Gardens - business_id = 2)
(8, 6, 'Succulents', 'Wide variety of succulents in all types and sizes'),
(8, 6, 'Indoor Plants', 'Houseplants including airplants and tropical indoor varieties'),
(8, 6, 'Aquatic Plants', 'Pond plants and water garden plants'),
(8, 6, 'Koi Pond Installation', 'Professional koi pond and water feature installation'),
(8, 6, 'Fountains & Water Features', 'Garden fountains and decorative water features'),
(8, 3, 'Garden Gifts', 'Planters, pottery, and nature-inspired gifts'),

-- SERVICES (The Waste Less Shop - business_id = 3)
(9, 7, 'Laundry Detergent Refill', 'Bulk refill station for eco-friendly laundry detergent'),
(9, 7, 'Dish Soap Refill', 'Refillable non-toxic dish soap'),
(9, 7, 'Shampoo & Conditioner Refill', 'Clean ingredient hair care available as bulk refills'),
(9, 8, 'Natural Skincare', 'Non-toxic lotion, sunscreen, and body wash'),
(9, 7, 'Reusable Products', 'Beeswax wraps, reusable bags, water bottles, and food storage'),
(9, 7, 'Cleaning Supplies', 'Non-toxic surface cleaner, glass cleaner, and kitchen essentials');