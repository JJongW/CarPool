# 모바일 UI 시스템 (ui-ux-pro-max 반영)

## 디자인 토큰
- Primary: `#2563EB`
- Secondary: `#3B82F6`
- CTA: `#F97316`
- Background: `#F8FAFC`
- Text: `#1E293B`
- Font: `Plus Jakarta Sans`

## 모바일 화면 구조
1. 오늘 상태 대시보드
2. 운행 차량 카드 리스트
3. 탑승 필요 인원 리스트
4. 비출근 인원 리스트

## 컴포넌트
- `TodaySummaryCard`: 운행 가능/탑승 필요/비출근 요약
- `RideOfferCard`: 운전자, 차량번호, 출근시간, 잔여좌석, 대기 수
- `CommuteStatusList`: 인원 상태 리스트
- `StatusBadge`: 상태별 색상 배지

## 접근성/상호작용 기준
- 버튼 높이 44px 이상으로 터치 영역 확보
- `focus-visible` 링 제공
- 텍스트 대비 4.5:1 이상 유지
- 애니메이션은 200ms 내 전환으로 최소화

## 추후 확장
- 바텀 네비게이션(홈/캘린더/내정보)
- 비출근일 캘린더 편집 화면
- 탑승 신청 승인/거절 모달
