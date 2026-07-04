# 샘플 프로젝트 Seed 데이터

이 문서는 Sunday Desk의 seed/test 데이터로 사용할 수 있는 프로젝트 샘플입니다.

실제 비밀키, IP, 계정정보, 내부 URL, 토큰은 포함하지 않습니다. 아래 내용은 포트폴리오 CMS와 템플릿 기반 생성기를 검증하기 위한 구조화된 예시 데이터입니다.

## 사용 목적

- 공개 포트폴리오 프로젝트 목록과 상세 페이지 테스트
- 관리자 프로젝트 CRUD 테스트
- 원본 메모 기반 포트폴리오 설명 생성 테스트
- 이력서 bullet 및 면접 Q&A 생성 테스트
- Supabase seed 데이터 작성 시 참고

## 공통 변환 기준

- `source_type`은 MVP 기준 `manual_note`를 사용합니다.
- 제공되지 않은 성과는 `성과: 추가 확인 필요`로 명시합니다.
- 성과 수치, 비용 절감 수치, 운영 지표는 제공된 사실만 사용합니다.
- 실제 비밀키, IP, 계정정보, 내부 시스템 주소는 seed 데이터에 넣지 않습니다.

---

## Project 1. 인천공항 국산화 셀프백드랍 구축

### Seed Block

```yaml
title: "인천공항 국산화 셀프백드랍 구축"
slug: "incheon-airport-localized-self-bag-drop"
summary: "공항 셀프백드랍 국산화 프로젝트에서 개발과 사업관리를 함께 수행하며 Java 기반 업무 시스템, Python 기반 비전 처리 구조, 현장 설치 및 UAT 일정을 조율한 프로젝트입니다."
role: "개발 및 사업관리"
company_or_context: "공항 셀프백드랍 국산화 프로젝트"
tech_stack:
  - "Java"
  - "JSP"
  - "Spring"
  - "MyBatis"
  - "Python"
  - "gRPC"
  - "OpenCV"
  - "YOLO/OpenVINO 검토"
problem: "공항 환경에서 안정적으로 동작하는 셀프백드랍 시스템을 구축하면서, 기존 Java 업무 시스템과 Python 기반 비전 처리 모듈을 연동할 수 있는 구조가 필요했습니다. 현장 설치, 항공사 연계 일정, UAT 대응, 협력사 조율도 함께 관리해야 했습니다."
solution: "Java 시스템과 Python 비전 처리 서버를 분리해 연동할 수 있는 gRPC 기반 구조를 검토하고, YOLO/ONNX/OpenVINO 기반 여권 및 객체 인식 후보를 비교했습니다. OpenCV 카메라 백엔드를 MSMF에서 CAP_DSHOW로 변경해 카메라 안정성을 개선했으며, 현장 설치와 UAT, 항공사 연계 일정을 관리했습니다."
result: "UAT 100%를 달성했고, 공정률은 계획 대비 100% 수준으로 관리했습니다. 비교견적과 협력사 조율을 통해 비용 관리를 수행했습니다."
contribution: "Python 기반 gRPC 비전 처리 서버 구조 검토, Java 시스템 연동 구조 설계, 비전 인식 후보 기술 검토, 카메라 안정성 개선, 현장 설치 및 UAT 일정 관리, 비교견적 및 협력사 조율을 담당했습니다."
source_type: "manual_note"
source_title: "인천공항 국산화 셀프백드랍 구축 원본 메모"
source_content: |
  - 공항 셀프백드랍 국산화 프로젝트
  - 개발 및 사업관리 역할 수행
  - Python 기반 gRPC 비전 처리 서버 구조 검토
  - Java 시스템과 연동 가능한 구조 설계
  - YOLO/ONNX/OpenVINO 기반 여권/객체 인식 후보 검토
  - OpenCV 카메라 백엔드 MSMF에서 CAP_DSHOW로 변경하여 안정성 개선
  - 현장 설치, UAT, 항공사 연계 일정 관리
  - UAT 100%
  - 공정률 계획 대비 100%
  - 비교견적 및 협력사 조율을 통한 비용 관리
```

### Raw Notes

- Python 기반 gRPC 비전 처리 서버 구조 검토
- Java 시스템과 연동 가능한 구조 설계
- YOLO/ONNX/OpenVINO 기반 여권/객체 인식 후보 검토
- OpenCV 카메라 백엔드 MSMF에서 CAP_DSHOW로 변경하여 안정성 개선
- 현장 설치, UAT, 항공사 연계 일정 관리
- UAT 100%
- 공정률 계획 대비 100%
- 비교견적 및 협력사 조율을 통한 비용 관리

---

## Project 2. 임시출입 키오스크 / Suprema BioStar 연동

### Seed Block

```yaml
title: "임시출입 키오스크 / Suprema BioStar 연동"
slug: "temporary-access-kiosk-suprema-biostar"
summary: "임시출입 발급 키오스크에서 출입통제 장비, RFID 리더, Suprema BioStar2 API를 연동해 사용자 카드와 출입 기간 갱신 흐름을 구성한 프로젝트입니다."
role: "연동 개발"
company_or_context: "임시출입 발급 키오스크 시스템"
tech_stack:
  - "Java"
  - "JSP"
  - "Node.js"
  - "Suprema BioStar2 API"
  - "WebSocket"
  - "RFID"
problem: "키오스크에서 발급되는 임시출입 정보와 출입통제 장비의 사용자, 카드, 출입 기간 정보를 연동해야 했습니다. RFID 리더 입력을 웹 화면의 발급 흐름과 연결하고, 장비 상태 및 이벤트 수신 흐름도 구성해야 했습니다."
solution: "Suprema BioStar2 API의 login, cards, users, updateUserPeriod 연동 흐름을 구성하고, Node.js 프록시 서버를 9000 포트로 두어 장비 API 연동을 중계했습니다. RFID 리더 입력을 JSP hidden cardID 값과 연결하고, 사용자 출입 기간을 PUT API로 갱신하는 흐름을 구성했습니다."
result: "성과: 추가 확인 필요"
contribution: "BioStar2 API 연동 흐름 구성, Node.js 프록시 서버 구성, RFID 리더 입력과 JSP 화면 데이터 연결, 사용자 출입 기간 갱신 API 연동, 장비 상태 및 이벤트 수신 흐름 구성을 담당했습니다."
source_type: "manual_note"
source_title: "임시출입 키오스크 / Suprema BioStar 연동 원본 메모"
source_content: |
  - 임시출입 발급 키오스크 시스템
  - 출입통제 장비 및 RFID 연동
  - Suprema BioStar2 API login, cards, users, updateUserPeriod 연동
  - Node.js 프록시 서버 9000 포트 구성
  - RFID 리더 입력을 JSP hidden cardID와 연결
  - 사용자 출입 기간 PUT API로 갱신
  - 장비 상태 및 이벤트 수신 흐름 구성
  - 성과: 추가 확인 필요
```

### Raw Notes

- Suprema BioStar2 API login, cards, users, updateUserPeriod 연동
- Node.js 프록시 서버 9000 포트 구성
- RFID 리더 입력을 JSP hidden cardID와 연결
- 사용자 출입 기간 PUT API로 갱신
- 장비 상태 및 이벤트 수신 흐름 구성
- 성과: 추가 확인 필요

---

## Project 3. Python gRPC 기반 비전 처리 서버 PoC

### Seed Block

```yaml
title: "Python gRPC 기반 비전 처리 서버 PoC"
slug: "python-grpc-vision-server-poc"
summary: "Java 업무 시스템과 Python 비전 처리 모듈을 분리하기 위해 gRPC와 Protocol Buffers 기반 서버 구조를 검토한 PoC 프로젝트입니다."
role: "PoC 설계 및 구현 검토"
company_or_context: "Java 업무 시스템과 Python 비전 처리 모듈 분리 PoC"
tech_stack:
  - "Python"
  - "gRPC"
  - "Protocol Buffers"
  - "OpenCV"
  - "ONNX Runtime"
  - "OpenVINO"
  - "YOLO"
problem: "Java 기반 업무 시스템에서 Python 비전 처리 기능을 직접 포함하지 않고, 독립적인 서버 모듈로 분리해 호출할 수 있는 구조가 필요했습니다. 향후 Java 클라이언트 연동과 비전 모델 교체 가능성을 고려해야 했습니다."
solution: "visioncore.v1 proto package를 설계하고 HealthCheck, DetectPassport RPC를 정의했습니다. Python grpc_tools.protoc로 pb2, pb2_grpc 파일을 생성하는 흐름을 검토했으며, Java 연동을 위해 java_package와 java_outer_classname 설정을 포함했습니다. 서버 구현부와 application service 계층을 분리하는 구조도 함께 검토했습니다."
result: "성과: 추가 확인 필요"
contribution: "gRPC proto 패키지 설계, HealthCheck 및 DetectPassport RPC 정의, Python 서버 코드 생성 흐름 검토, Java 클라이언트 연동을 고려한 proto 옵션 설정, 서버 구현부와 application service 계층 분리 방향 검토를 담당했습니다."
source_type: "manual_note"
source_title: "Python gRPC 기반 비전 처리 서버 PoC 원본 메모"
source_content: |
  - Java 업무 시스템과 Python 비전 처리 모듈을 분리하기 위한 PoC
  - Python 서버와 Java 클라이언트 연동을 고려한 구조 설계
  - visioncore.v1 proto package 설계
  - HealthCheck, DetectPassport RPC 정의
  - Python grpc_tools.protoc로 pb2, pb2_grpc 생성
  - Java 연동을 고려해 java_package, java_outer_classname 설정
  - 서버 구현부와 application service 계층 분리 검토
  - 성과: 추가 확인 필요
```

### Raw Notes

- visioncore.v1 proto package 설계
- HealthCheck, DetectPassport RPC 정의
- Python grpc_tools.protoc로 pb2, pb2_grpc 생성
- Java 연동을 고려해 java_package, java_outer_classname 설정
- 서버 구현부와 application service 계층 분리 검토
- 성과: 추가 확인 필요
