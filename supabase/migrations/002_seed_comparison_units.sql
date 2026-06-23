-- Seed comparison units with real-world USD values (2024 estimates)
insert into comparison_units (name, slug, category, value, description, source_url) values

-- Consumer goods
('Big Mac', 'big-mac', 'consumer', 5.69,
 'Average US price of a McDonald''s Big Mac',
 'https://www.statista.com/statistics/274326/big-mac-index-global-prices-for-a-big-mac/'),

('iPhone 16 Pro', 'iphone-16-pro', 'consumer', 999.00,
 'Base price of Apple iPhone 16 Pro (128GB)',
 'https://www.apple.com/shop/buy-iphone/iphone-16-pro'),

('Lamborghini Revuelto', 'lamborghini-revuelto', 'consumer', 517770.00,
 'Base MSRP of the Lamborghini Revuelto (2024)',
 'https://www.lamborghini.com/en-en/models/revuelto'),

('Starbucks Latte', 'starbucks-latte', 'consumer', 7.00,
 'Average price of a Starbucks Grande Latte in the US',
 'https://www.statista.com/statistics/1246049/starbucks-drink-price/'),

('Netflix Subscription', 'netflix-subscription', 'consumer', 22.99,
 'Netflix Standard HD monthly subscription (US)',
 'https://www.netflix.com/signup'),

-- Assets
('Average US Home', 'average-us-home', 'asset', 420000.00,
 'Median sale price of existing US homes (2024)',
 'https://www.nar.realtor/research-and-statistics/housing-statistics/existing-home-sales'),

('Private Jet (Gulfstream G650)', 'private-jet-gulfstream', 'asset', 65000000.00,
 'Approximate list price of a Gulfstream G650ER',
 'https://www.gulfstream.com/en/aircraft/gulfstream-g650er/'),

('Superyacht (90m)', 'superyacht-90m', 'asset', 300000000.00,
 'Approximate build cost of a 90-metre superyacht',
 'https://www.superyachttimes.com'),

('Commercial Boeing 737 MAX', 'boeing-737-max', 'asset', 100000000.00,
 'Approximate list price of a Boeing 737 MAX 8',
 'https://www.boeing.com/commercial/737max'),

('Aircraft Carrier (USS Gerald R. Ford)', 'aircraft-carrier', 'asset', 13300000000.00,
 'Total construction cost of USS Gerald R. Ford (CVN-78)',
 'https://www.defensenews.com'),

-- Benchmarks
('NASA Annual Budget', 'nasa-budget', 'benchmark', 25400000000.00,
 'NASA FY2024 budget appropriation',
 'https://www.nasa.gov/wp-content/uploads/2024/03/nasa-fy2024-budget-request.pdf'),

('Pentagon Annual Budget', 'pentagon-budget', 'benchmark', 858000000000.00,
 'US Department of Defense FY2024 budget',
 'https://comptroller.defense.gov/Budget-Materials/'),

('GDP of Monaco', 'gdp-monaco', 'benchmark', 9000000000.00,
 'GDP of Monaco (2023 estimate, World Bank)',
 'https://data.worldbank.org/country/monaco'),

('GDP of New Zealand', 'gdp-new-zealand', 'benchmark', 252000000000.00,
 'GDP of New Zealand (2023, World Bank)',
 'https://data.worldbank.org/country/new-zealand'),

('Rockefeller Fortune (inflation-adjusted)', 'rockefeller-fortune', 'benchmark', 340000000000.00,
 'John D. Rockefeller''s estimated peak net worth adjusted to 2024 USD',
 'https://en.wikipedia.org/wiki/John_D._Rockefeller'),

('Harvard Endowment', 'harvard-endowment', 'benchmark', 51000000000.00,
 'Harvard University endowment (2023)',
 'https://www.harvard.edu/about/endowment/');
