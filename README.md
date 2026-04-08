# 311통신대대 카풀방

차량 2부제(홀짝)와 개인 비출근일(휴가/휴무/청원휴가/근취)을 함께 반영해 당일 카풀 운행 가능 인원과 탑승 웨이팅을 관리하는 모바일 웹앱입니다.

## 프로젝트 구조
- `web`: Next.js 모바일 웹앱
- `supabase/migrations`: DB 스키마/정책
- `docs/DomainRules.md`: 도메인 상태 전이 규칙
- `docs/SupabaseSchema.md`: 테이블/인덱스/RLS 요약
- `docs/MobileUiSystem.md`: UI 시스템과 화면 설계
- `design-system/311통신대대-카풀방`: ui-ux-pro-max 생성 디자인 시스템

## 실행 방법
1. `cd web`
2. `cp .env.example .env.local`
3. Supabase 키 입력
4. `npm install`
5. `npm run dev`

## DB 적용
- Supabase SQL Editor에서 `supabase/migrations/001_init.sql` 실행
- RLS 정책 포함되어 있어 Auth 사용자 기준 권한이 자동 적용됩니다.

## 핵심 기능
- 날짜 기반 홀짝 운행 자동 판정
- 개인 비출근일 반영
- 운행 등록/탑승 신청/승인/거절/웨이팅 승격
- 모바일 우선 UI(터치 타겟, 포커스 상태, 대비)

## 배포 (Vercel)
1. Vercel에 `web` 디렉토리를 루트로 연결
2. 환경변수 등록
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. 배포 후 모바일 viewport에서 동작 확인