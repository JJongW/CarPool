# Supabase 스키마/RLS 설계

## 테이블 개요
- `profiles`: 사용자 기본 정보 및 권한(`USER`/`ADMIN`)
- `vehicles`: 차량 정보(번호, 끝자리, 정원)
- `attendance_exceptions`: 비출근일 관리
- `service_calendar`: 날짜별 홀짝 정책/예외
- `ride_offers`: 운전자가 당일 등록한 운행 건
- `ride_requests`: 탑승 신청/대기/승인 상태
- `audit_logs`: 주요 액션 로그

## 제약조건/인덱스 핵심
- `attendance_exceptions (user_id, day)` 유니크
- `ride_offers (day, driver_id)` 유니크
- `ride_requests` 활성 상태 중복 방지 인덱스:
  - 같은 `offer_id`, `rider_id`에 대해 `WAITING`/`APPROVED` 중복 금지
- 웨이팅 성능 인덱스:
  - `(offer_id, status, queue_order)`

## RLS 정책 요약
- 프로필: 본인 생성/수정, 전체 조회 허용
- 차량/비출근일: 본인만 CRUD
- 운행 건:
  - 조회는 인증 사용자 전체
  - 생성/수정/삭제는 해당 운전자만
- 탑승 신청:
  - 생성은 본인만
  - 수정은 본인 또는 해당 운행 운전자
- 운영 캘린더/감사로그 조회:
  - `ADMIN` 권한만 쓰기(캘린더), 조회(감사로그)

## 운영 메모
- `service_calendar`에 특정일 예외를 넣지 않으면 앱에서 날짜 홀짝 자동 계산 로직을 사용한다.
- `audit_logs`는 배차 승인/거절, 웨이팅 승격 이벤트를 저장하도록 앱에서 호출한다.
