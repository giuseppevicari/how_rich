-- Seed top 10 billionaires with a static dev snapshot (2024-06-23)
-- This is a fallback dataset; production data comes from the daily Forbes refresh

insert into billionaires (id, name, image_url, slug) values
('00000000-0000-0000-0000-000000000001', 'Elon Musk',         'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/440px-Elon_Musk_Royal_Society_%28crop2%29.jpg', 'elon-musk'),
('00000000-0000-0000-0000-000000000002', 'Jeff Bezos',        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Jeff_Bezos_at_Amazon_Spheres_05_crop.jpg/440px-Jeff_Bezos_at_Amazon_Spheres_05_crop.jpg', 'jeff-bezos'),
('00000000-0000-0000-0000-000000000003', 'Mark Zuckerberg',   'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/440px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg', 'mark-zuckerberg'),
('00000000-0000-0000-0000-000000000004', 'Larry Ellison',     null, 'larry-ellison'),
('00000000-0000-0000-0000-000000000005', 'Bill Gates',        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Bill_Gates_2017_%28cropped%29.jpg/440px-Bill_Gates_2017_%28cropped%29.jpg', 'bill-gates'),
('00000000-0000-0000-0000-000000000006', 'Warren Buffett',    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Warren_Buffett_KU_Visit.jpg/440px-Warren_Buffett_KU_Visit.jpg', 'warren-buffett'),
('00000000-0000-0000-0000-000000000007', 'Larry Page',        null, 'larry-page'),
('00000000-0000-0000-0000-000000000008', 'Sergey Brin',       null, 'sergey-brin'),
('00000000-0000-0000-0000-000000000009', 'Steve Ballmer',     null, 'steve-ballmer'),
('00000000-0000-0000-0000-000000000010', 'Jensen Huang',      null, 'jensen-huang');

-- Static snapshot for dev (net worth in USD)
insert into wealth_snapshots (billionaire_id, date, net_worth, rank, source) values
('00000000-0000-0000-0000-000000000001', '2024-06-23', 221000000000, 1, 'forbes-seed'),
('00000000-0000-0000-0000-000000000002', '2024-06-23', 212000000000, 2, 'forbes-seed'),
('00000000-0000-0000-0000-000000000003', '2024-06-23', 175000000000, 3, 'forbes-seed'),
('00000000-0000-0000-0000-000000000004', '2024-06-23', 147000000000, 4, 'forbes-seed'),
('00000000-0000-0000-0000-000000000005', '2024-06-23', 135000000000, 5, 'forbes-seed'),
('00000000-0000-0000-0000-000000000006', '2024-06-23', 132000000000, 6, 'forbes-seed'),
('00000000-0000-0000-0000-000000000007', '2024-06-23', 111000000000, 7, 'forbes-seed'),
('00000000-0000-0000-0000-000000000008', '2024-06-23', 107000000000, 8, 'forbes-seed'),
('00000000-0000-0000-0000-000000000009', '2024-06-23',  99000000000, 9, 'forbes-seed'),
('00000000-0000-0000-0000-000000000010', '2024-06-23',  96000000000, 10, 'forbes-seed');
