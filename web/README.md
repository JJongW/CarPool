# 311통신대대 카풀방 웹앱

모바일 화면 전용 카풀 관리 앱입니다. 날짜 홀짝 규칙과 개인 비출근일을 기준으로 운행 가능 인원/탑승 필요 인원/웨이팅 상태를 표시합니다.

## Getting Started

1) 환경변수 파일 생성

```bash
cp .env.example .env.local
```

2) Supabase 키 입력

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=<server-only-key>
```

- `NEXT_PUBLIC_*` 값은 클라이언트에서 사용됩니다.
- `SUPABASE_SERVICE_ROLE_KEY`는 서버 전용입니다. 클라이언트 코드에서 사용하면 안 됩니다.
- Vercel 배포 시 `NEXT_PUBLIC_APP_URL`은 실제 배포 도메인으로 설정하세요.

3) 개발 서버 실행

```bash
npm run dev
```

4) 검증

```bash
npm run lint
npm run build
```

## 핵심 기능

- 당일 홀짝 운행 규칙 자동 계산
- 비출근일(휴가/휴무/청원휴가/근취) 상태 반영
- 운행 차량 카드 + 탑승 신청 + 웨이팅 순번
- 승인/거절 시 자동 대기열 승격
- 모바일 접근성 중심 UI(포커스/터치 타겟/명도 대비)

## 테스트 시나리오

- 차량 보유 + 당일 출근 가능 사용자: 운행 가능으로 분류되는지 확인
- 차량 보유 + 휴가 사용자: 비출근으로 분류되고 배차 제외되는지 확인
- 차량 미보유 사용자: 탑승 필요 목록으로 분류되는지 확인
- 좌석 초과 신청 후 거절 처리: 다음 대기자가 승인 상태로 승격되는지 확인

## Vercel 배포

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
프로젝트 연결 시 `web` 디렉토리를 Root Directory로 지정하고 환경변수를 동일하게 등록하면 됩니다.

### Supabase Auth 추가 설정 체크
- Supabase Dashboard > Authentication > URL Configuration
  - Site URL: `NEXT_PUBLIC_APP_URL`
  - Redirect URLs:
    - `http://localhost:3000`
    - `https://web-sigma-nine-93.vercel.app`
