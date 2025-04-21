/*
  # Add sample cars for testing

  1. New Data
    - Add 5 iconic JDM cars with detailed specifications
    - Include high-quality images for each car
    - Set realistic prices and specifications

  2. Cars Added
    - Nissan Skyline GT-R R34 V-Spec II Nür
    - Toyota Supra RZ JZA80
    - Mazda RX-7 FD3S Spirit R Type A
    - Honda NSX-R NA2
    - Mitsubishi Lancer Evolution VI Tommi Makinen Edition
*/

-- Insert sample cars
INSERT INTO cars (
  reference_number,
  make,
  model,
  year,
  price,
  mileage,
  engine_type,
  engine_size,
  transmission,
  drivetrain,
  horsepower,
  torque,
  color,
  location,
  status,
  description,
  features
) VALUES
-- Nissan Skyline GT-R R34 V-Spec II Nür
(
  'JDM-R34-001',
  'Nissan',
  'Skyline GT-R R34 V-Spec II Nür',
  2002,
  289000,
  76000,
  'RB26DETT Twin-Turbo',
  '2.6L',
  '6-Speed Manual',
  'AWD',
  330,
  '392 Nm',
  'Millennium Jade',
  'Rotterdam',
  'available',
  'Rare V-Spec II Nür edition, one of only 718 produced. Complete service history, original paint, and documented import history.',
  ARRAY['ATTESA E-TS AWD', 'Multi-Function Display', 'Brembo Brakes', 'NISMO Upgrades', 'Limited Slip Differential']
),
-- Toyota Supra RZ
(
  'JDM-SUP-001',
  'Toyota',
  'Supra RZ',
  1994,
  145000,
  89000,
  '2JZ-GTE Twin-Turbo',
  '3.0L',
  '6-Speed Manual',
  'RWD',
  320,
  '427 Nm',
  'Super White',
  'Rotterdam',
  'available',
  'Unmolified JZA80 Supra with original 2JZ-GTE engine. Recent timing belt service and new turbos.',
  ARRAY['Traction Control', 'Limited Slip Differential', 'Sport ABS', 'Power Windows', 'Factory Turbo Timer']
),
-- Mazda RX-7 Spirit R
(
  'JDM-RX7-001',
  'Mazda',
  'RX-7 Spirit R Type A',
  2002,
  159000,
  65000,
  '13B-REW Twin-Rotor Twin-Turbo',
  '1.3L',
  '6-Speed Manual',
  'RWD',
  280,
  '314 Nm',
  'Titanium Grey',
  'Rotterdam',
  'available',
  'Rare Spirit R Type A, the ultimate evolution of the FD3S. Factory extras include lightweight bucket seats and special suspension tuning.',
  ARRAY['Recaro Seats', 'BBS Wheels', 'Adjustable Suspension', 'Limited Slip Differential', 'Factory Aero Kit']
),
-- Honda NSX-R
(
  'JDM-NSX-001',
  'Honda',
  'NSX-R',
  2002,
  395000,
  45000,
  'C32B NA V6',
  '3.2L',
  '6-Speed Manual',
  'RWD',
  290,
  '304 Nm',
  'Championship White',
  'Rotterdam',
  'available',
  'Rare NSX-R variant with extensive weight reduction and track-focused modifications from the factory.',
  ARRAY['Carbon Fiber Hood', 'Recaro Carbon-Kevlar Seats', 'MOMO Steering Wheel', 'Limited Slip Differential', 'Mesh BBS Wheels']
),
-- Mitsubishi Evo VI TME
(
  'JDM-EVO-001',
  'Mitsubishi',
  'Lancer Evolution VI TME',
  2000,
  129000,
  92000,
  '4G63T Turbo',
  '2.0L',
  '5-Speed Manual',
  'AWD',
  280,
  '373 Nm',
  'Scotia White',
  'Rotterdam',
  'available',
  'Genuine Tommi Makinen Edition in excellent condition. Features special rally-inspired upgrades and distinctive red/black interior.',
  ARRAY['Recaro Seats', 'MOMO Steering Wheel', 'Brembo Brakes', 'Quick-Ratio Steering', 'Rally Sport Suspension']
);

-- Insert car images
INSERT INTO car_images (
  car_id,
  url,
  is_primary
) VALUES
-- R34 GT-R Images
(
  (SELECT id FROM cars WHERE reference_number = 'JDM-R34-001'),
  'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?auto=format&fit=crop&q=80',
  true
),
-- Supra Images
(
  (SELECT id FROM cars WHERE reference_number = 'JDM-SUP-001'),
  'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&q=80',
  true
),
-- RX-7 Images
(
  (SELECT id FROM cars WHERE reference_number = 'JDM-RX7-001'),
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80',
  true
),
-- NSX Images
(
  (SELECT id FROM cars WHERE reference_number = 'JDM-NSX-001'),
  'https://images.unsplash.com/photo-1607603750909-408e193868c7?auto=format&fit=crop&q=80',
  true
),
-- Evo Images
(
  (SELECT id FROM cars WHERE reference_number = 'JDM-EVO-001'),
  'https://images.unsplash.com/photo-1609952048180-7b35ea6b083b?auto=format&fit=crop&q=80',
  true
);

-- Insert detailed specifications for each car
INSERT INTO car_specs (
  car_id,
  category,
  name,
  value
) 
SELECT 
  id as car_id,
  category,
  name,
  value
FROM cars
CROSS JOIN (
  VALUES
    ('Engine', 'Displacement', '2.6L'),
    ('Engine', 'Configuration', 'Inline-6'),
    ('Engine', 'Induction', 'Twin-Turbo'),
    ('Performance', 'Power', '330 HP @ 6800 rpm'),
    ('Performance', 'Torque', '392 Nm @ 4400 rpm'),
    ('Performance', '0-100 km/h', '4.9 seconds'),
    ('Transmission', 'Type', '6-Speed Manual'),
    ('Transmission', 'Drive', 'ATTESA E-TS AWD'),
    ('Chassis', 'Suspension', 'Multilink'),
    ('Chassis', 'Brakes', 'Brembo 4-Piston')
) as specs(category, name, value)
WHERE reference_number = 'JDM-R34-001'

UNION ALL

SELECT 
  id as car_id,
  category,
  name,
  value
FROM cars
CROSS JOIN (
  VALUES
    ('Engine', 'Displacement', '3.0L'),
    ('Engine', 'Configuration', 'Inline-6'),
    ('Engine', 'Induction', 'Twin-Turbo'),
    ('Performance', 'Power', '320 HP @ 5600 rpm'),
    ('Performance', 'Torque', '427 Nm @ 4000 rpm'),
    ('Performance', '0-100 km/h', '4.6 seconds'),
    ('Transmission', 'Type', '6-Speed Manual'),
    ('Transmission', 'Drive', 'RWD'),
    ('Chassis', 'Suspension', 'Double Wishbone'),
    ('Chassis', 'Brakes', '4-Piston Front, 2-Piston Rear')
) as specs(category, name, value)
WHERE reference_number = 'JDM-SUP-001';