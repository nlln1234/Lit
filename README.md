⚡ OutSystems & Lit: 바이브 코딩 프로젝트
"로우코드 환경을 위한 차세대 UI 개발 방법론" OutSystems 환경에서 Google Anti-Gravity와 Lit를 결합하여, 디자인 구현의 한계를 넘어서는 바이브 코딩 방법론을 적용한 프로젝트입니다.

📖 1. 프로젝트 개요
이 프로젝트는 OutSystems의 생산성과 표준 웹 기술의 유연성을 결합하여 고성능 커스텀 UI를 효율적으로 구축하는 것을 목표로 합니다.

기존 OutSystems 개발 방식에서는 복잡한 대시보드나 동적 인터랙션을 구현할 때 테마 커스터마이징의 한계와 복잡도가 발생하곤 했습니다. 이를 해결하기 위해 AI 기반의 바이브 코딩과 Web Components 기술을 접목했습니다.

핵심 접근 방식:

AI 협업: 복잡한 UI 로직은 AI 에이전트와 대화하며 실시간으로 구현합니다.

표준화: 결과물을 Lit 기반의 웹 컴포넌트로 캡슐화하여 재사용성을 확보합니다.

통합: OutSystems에는 단일 블록으로 배포하여 유지보수 복잡도를 획기적으로 낮춥니다.

🎯 2. 기술 선정 배경 (Why Lit?)
수많은 프레임워크 중 React나 Vue가 아닌, Lit를 핵심 기술로 채택한 이유는 다음과 같습니다.

✅ 2.1. 표준 웹 컴포넌트 기반
Lit는 브라우저 표준인 Web Components 기술을 기반으로 합니다.

빌드 과정 없음: 별도의 복잡한 빌드 도구 없이 브라우저에서 바로 실행되므로, OutSystems의 배포 라이프사이클과 충돌 없이 완벽하게 호환됩니다.

높은 호환성: 리액트 앱을 빌드해서 삽입하는 방식과 달리, 가볍게 스크립트만 로드하여 즉시 사용할 수 있습니다.

✅ 2.2. Shadow DOM 활용
OutSystems에서 커스텀 UI를 개발할 때 가장 큰 문제는 전역 CSS 충돌입니다.

Lit는 Shadow DOM을 기본으로 사용하여, 컴포넌트의 스타일이 OutSystems 테마의 영향을 받거나 외부에 영향을 주지 않습니다.

복잡한 스타일이 적용된 UI도 기존 시스템 디자인을 해치지 않고 안전하게 통합됩니다.

✅ 2.3. 초경량 및 고성능
5kb의 초경량 사이즈로 애플리케이션의 초기 로딩 속도에 거의 영향을 주지 않습니다.

불필요한 가상 돔 연산 없이 변경된 부분만 정밀하게 업데이트하므로, 대시보드나 차트 같은 데이터 집약적 화면 처리에 최적화되어 있습니다.

🛠️ 3. Anti-Gravity 워크플로우
이 프로젝트는 Google Anti-Gravity IDE를 활용한 2단계 바이브 코딩 프로세스로 진행됩니다.

🌊 1단계: HTML 프로토타이핑 (HTML-First)
OutSystems 종속성 없이, 순수 HTML/JS 환경에서 디자인과 기능을 먼저 완성합니다.

AI 에이전트를 활용하여 피그마 시안과 동일한 수준의 시각적 완성도를 빠르게 확보합니다.

🌊 2단계: Lit 캡슐화 및 슬롯 적용
검증된 HTML 코드를 Lit Class로 변환하여 컴포넌트화합니다. (outsystems-component.js)

슬롯 시스템: OutSystems 데이터를 주입할 수 있도록 주요 UI 영역을 슬롯으로 변환합니다.

예: 정적 텍스트 → <slot name="title">...</slot>

🚀 4. OutSystems 적용 가이드
4.1. 스크립트 로드
Lit 라이브러리는 전역에서 한 번만 로드되도록 설정합니다. (레이아웃 또는 공통 블록 OnReady 액션)

JavaScript

if (!window.__litPromise) {
  window.__litPromise = import('.../LitAll_min.js').then(m => {
      window.Lit = m;
      return m;
  });
}
4.2. 데이터 바인딩 전략
이 컴포넌트는 두 가지 방식의 데이터 주입을 지원합니다.

슬롯 방식 (UI 위젯 주입):

제목, 날짜 등 단일 텍스트나 UI는 OutSystems 위젯(Expression 등)을 배치하고 Attribute 속성에 slot="name"을 지정하여 주입합니다.

장점: OutSystems에서 폰트, 색상, 스타일을 자유롭게 제어할 수 있습니다.

속성 방식 (대량 데이터 주입):

차트 데이터, 테이블 리스트 등 복잡한 데이터는 JSON 또는 List 형태로 변환하여 Lit 프로퍼티에 주입합니다.

예시: rowSalesValues (Text List), activeTab (Text)

📝 5. 참고 사항
IDE: Google Anti-Gravity

핵심 기술: Lit 3.0, OutSystems O11

라이선스: 사내 사용 전용

Created with Google Anti-Gravity