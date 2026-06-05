create or replace function live_alert_stats()
returns json
language sql
security definer
set search_path = public
as $$
  with last_alert as (
    select max(sent_at) as t from notification_log where type = 'clase'
  ),
  win as (
    select n.* from notification_log n, last_alert
    where n.type = 'clase' and n.sent_at >= last_alert.t - interval '20 minutes'
  ),
  last_stream as (
    select id from live_streams order by created_at desc limit 1
  )
  select json_build_object(
    'last_at',     (select t from last_alert),
    'push_sent',   (select count(*) from win where channel = 'push' and status = 'sent'),
    'push_failed', (select count(*) from win where channel = 'push' and status = 'failed'),
    'push_no_sub', (select count(*) from win where channel = 'push' and status = 'no_subscription'),
    'email',       (select count(*) from win where channel = 'email'),
    'sms_sent',    (select count(*) from sms_send_log where sent_at >= (select t from last_alert) - interval '40 minutes' and status in ('sent','queued','delivered','accepted')),
    'sms_failed',  (select count(*) from sms_send_log where sent_at >= (select t from last_alert) - interval '40 minutes' and status in ('failed','undelivered')),
    'used',        (select count(distinct student_email) from stream_attendance where stream_id = (select id from last_stream) and source = 'notif')
  );
$$;
grant execute on function live_alert_stats() to anon, authenticated;
