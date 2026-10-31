-- Run only in SQL Editor as postgres. All test users and writes are rolled back.
begin;
insert into auth.users(id,email,email_confirmed_at) values
 ('e1cf371a-02bf-4593-bb8b-38eb835d7f11','cms-test-paradise@example.invalid',now()),
 ('e1cf371a-02bf-4593-bb8b-38eb835d7f12','cms-test-speed@example.invalid',now());
insert into public.store_admins(site_id,user_id) values
 ('paradise','e1cf371a-02bf-4593-bb8b-38eb835d7f11'),
 ('speed-diecast','e1cf371a-02bf-4593-bb8b-38eb835d7f12');
set local role authenticated;
select set_config('request.jwt.claim.sub','e1cf371a-02bf-4593-bb8b-38eb835d7f11',true);
do $$ declare doc public.store_documents; begin
 if not public.is_store_admin('paradise') or public.is_store_admin('speed-diecast') then raise exception 'FAIL: isolamento PARADISE'; end if;
 select * into strict doc from public.store_documents where site_id='paradise';
 perform public.save_store_document('paradise',doc.content,doc.revision);
 begin perform public.save_store_document('paradise',doc.content,doc.revision); raise exception 'FAIL: conflito de versão aceito'; exception when serialization_failure then null; end;
 begin perform public.save_store_document('speed-diecast',doc.content,1); raise exception 'FAIL: escrita cruzada permitida'; exception when insufficient_privilege then null; end;
 begin update public.store_documents set revision=0; raise exception 'FAIL: update direto permitido'; exception when insufficient_privilege then null; end;
end $$;
select set_config('request.jwt.claim.sub','e1cf371a-02bf-4593-bb8b-38eb835d7f12',true);
do $$ begin if not public.is_store_admin('speed-diecast') or public.is_store_admin('paradise') then raise exception 'FAIL: isolamento SPEED'; end if; end $$;
select set_config('request.jwt.claim.sub','e1cf371a-02bf-4593-bb8b-38eb835d7f13',true);
do $$ begin if public.is_store_admin('paradise') or public.is_store_admin('speed-diecast') then raise exception 'FAIL: usuário comum autorizado'; end if; end $$;
set local role anon;
do $$ begin
 if (select count(*) from public.store_documents)<>2 then raise exception 'FAIL: leitura pública'; end if;
 begin perform public.save_store_document('paradise','{}',1); raise exception 'FAIL: visitante escreveu'; exception when insufficient_privilege then null; end;
 begin perform email from public.store_admin_emails; raise exception 'FAIL: permissões expostas'; exception when insufficient_privilege then null; end;
end $$;
rollback;
select 'PASS: leitura pública, escrita protegida, isolamento entre lojas e conflito de versão; testes revertidos.' as resultado;
