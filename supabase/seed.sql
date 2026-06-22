-- Seed data: İlk admin user oluştur
--
-- NOT: Supabase Auth, kullanıcı doğrulamasını auth.users tablosuna karşı yapar.
-- Sadece public.users'a satır eklemek giriş yapmaya yetmez; auth.users'da da
-- eşleşen bir kayıt olmalı. Bu yüzden aşağıda her ikisine de aynı id ile
-- (GoTrue'nun beklediği zorunlu alanlarla) kayıt ekliyoruz.

do $$
declare
  admin_id uuid := gen_random_uuid();
begin
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
  ) values (
    '00000000-0000-0000-0000-000000000000',
    admin_id,
    'authenticated',
    'authenticated',
    'admin@esarp.com',
    crypt('AdminPassword123!', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  on conflict (email) do nothing;

  insert into public.users (
    id,
    email,
    ad,
    soyad,
    role,
    email_dogrulanmis,
    kayit_tarihi
  )
  select id, email, 'Admin', 'Esarp', 'admin', true, now()
  from auth.users
  where email = 'admin@esarp.com'
  on conflict (email) do nothing;
end $$;
