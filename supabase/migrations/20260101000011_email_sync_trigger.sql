-- auth.users.email değiştiğinde (email değiştirme onayı tamamlandığında)
-- public.users.email otomatik senkronlanır. Daha önce sadece INSERT
-- trigger'ı vardı; email değişikliği public.users'a hiç yansımıyordu.

create or replace function public.handle_user_email_updated()
returns trigger as $$
begin
  if new.email is distinct from old.email then
    update public.users
    set email = new.email, email_dogrulanmis = (new.email_confirmed_at is not null)
    where id = new.id;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_email_updated on auth.users;

create trigger on_auth_user_email_updated
  after update on auth.users
  for each row execute function public.handle_user_email_updated();
