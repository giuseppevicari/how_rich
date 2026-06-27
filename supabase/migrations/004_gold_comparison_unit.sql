-- Add 1 tonne of gold as a dynamic comparison unit.
-- Value is seeded at ~$3,300/oz (June 2026); the daily refresh cron updates it.
-- 1 tonne = 1,000,000g / 31.1035 g/oz = 32,150.75 troy ounces
insert into comparison_units (name, slug, category, value, description, source_url)
values (
  'Tonne of Gold',
  'tonne-of-gold',
  'asset',
  106100000.00,
  '1 metric tonne (1,000 kg) of gold at the current spot price. Value updated daily.',
  'https://www.coinbase.com/converter/xau/usd'
)
on conflict (slug) do update
  set value = excluded.value,
      name  = excluded.name;
