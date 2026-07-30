# TaskManager :clipboard:

**TaskManager**는 할 일 관리 웹 애플리케이션으로, 사용자가 할 일을 생성, 수정, 삭제하며 상태를 추적할 수 있는 기능을 제공합니다. 실시간 동기화 기능을 통해 여러 사용자가 동시에 작업을 할 수 있으며, **React**와 **Spring Boot**를 사용하여 개발되었습니다.

## :rocket: 프로젝트 개요

- **기능**: 사용자는 할 일을 추가하고, 수정 및 삭제할 수 있으며, 각 할 일의 상태를 **진행중**, **완료됨**, **대기중**으로 변경할 수 있습니다. 실시간 동기화를 통해 다른 사용자의 작업을 실시간으로 확인할 수 있습니다.
- **인증**: 사용자는 **Google OAuth 2.0**을 통해 로그인하고, **JWT**를 사용하여 인증을 유지합니다.
- **배포**: **Docker**와 **Kubernetes**를 사용하여 클러스터 환경에 배포되었습니다.

## :sparkles: 기능

- **할 일 관리**: 할 일 생성, 수정, 삭제 및 상태 변경 (진행중, 완료됨, 대기중)
- **실시간 동기화**: **WebSocket**을 활용하여 여러 사용자가 동시에 작업을 업데이트할 수 있도록 지원
- **사용자 인증**: **Google OAuth 2.0** 로그인 및 **JWT** 기반 인증
- **상태별 필터링**: 진행중, 완료됨, 대기중 상태로 할 일 목록 필터링
- **Drag and Drop**: 할 일 목록 우선순위 조정 기능
- **알림 시스템**: 실시간 알림 기능 제공

## :wrench: 기술 스택

### **프론트엔드**
- **React** (React Hooks, Context API)
- **Material UI** (MUI)
- **WebSocket** (실시간 동기화)
- **Axios** (API 통신)
- **React Router** (SPA 라우팅)

### **백엔드**
- **Spring Boot** (RESTful API)
- **Spring Security** (JWT 인증)
- **Google OAuth 2.0** (OAuth 인증)
- **QueryDSL** (동적 쿼리)
- **WebSocket** (실시간 알림)

### **배포 및 관리**
- **Docker** (애플리케이션 컨테이너화)
- **Kubernetes** (클러스터 배포 및 관리)
- **AWS** (AWS ECS/EKS, DynamoDB 등)

## :floppy_disk: 설치 방법

1. 이 프로젝트를 클론합니다:
    ```bash
    git clone https://github.com/your-username/TaskManager.git
    ```

2. 프론트엔드 의존성을 설치합니다:
    ```bash
    cd taskmanager-fe
    npm install
    ```

3. 백엔드 의존성을 설치합니다:
    ```bash
    cd TaskManager
    ./gradlew build
    ```

4. Docker로 애플리케이션을 빌드하고 실행합니다:
    ```bash
    docker build -t taskmanager:latest .
    ```
5. **Kubernetes**에 배포하기 위한 설정:
    - **Kubernetes Deployment** 및 **Service** 설정 파일을 작성하여 클러스터에 배포합니다. (예: `taskmanager-backend-deployment.yaml`, `taskmanager-frontend-deployment.yaml`)

6. Kubernetes 클러스터에 배포:
    ```bash
    # 배포 파일 적용
    kubectl apply -f k8s/backend-deployment.yaml
    kubectl apply -f k8s/frontend-deployment.yaml

    # 서비스 파일 적용
    kubectl apply -f k8s/backend-service.yaml
    kubectl apply -f k8s/frontend-service.yaml
    ```

7. 로컬 환경에서 애플리케이션에 접근합니다:
    - 프론트엔드: `http://localhost:5173`
    - 백엔드: `http://localhost:8080`

## :pencil2: 사용법

1. **회원가입 및 로그인**: **Google OAuth 2.0**을 사용하여 구글 계정으로 로그인합니다.
2. **할 일 추가**: 할 일을 추가하려면 입력 창에 제목을 입력하고 추가 버튼을 클릭합니다.
3. **할 일 상태 변경**: 할 일 항목을 클릭하여 상태를 진행중, 완료됨, 대기중으로 변경할 수 있습니다.
4. **실시간 동기화**: 다른 사용자가 할 일을 추가하거나 상태를 변경하면 실시간으로 업데이트됩니다.
5. **우선순위 조정**: **Drag and Drop** 기능을 사용하여 할 일 목록의 우선순위를 조정할 수 있습니다.

## :memo: 기여 방법

1. **Fork** 후 변경 사항을 **브랜치**로 작업합니다.
2. **Pull Request**를 보내기 전에 **테스트**와 **문서화**를 완료합니다.


## :hammer_and_wrench: 트러블슈팅

프로젝트를 Docker 기반으로 재구성하고 기능을 확장하는 과정에서 겪은 문제와 해결 과정을 정리했습니다.

### 1. Dockerfile 유실 및 경로 불일치
- **문제**: Dockerfile이 git에 커밋된 적이 없어 로컬에서만 존재하다가 삭제됨. 복구 과정에서 `ENTRYPOINT`의 실행 경로(`app.jar`)와 `COPY`로 복사한 실제 경로(`/app/app.jar`)가 불일치해 `Unable to access jarfile app.jar` 에러 발생.
- **해결**: `WORKDIR /app`으로 통일하고 `ENTRYPOINT`에 절대경로를 명시. 이후 Dockerfile을 git에 커밋해 동일 문제 재발 방지.

### 2. 컨테이너 간 네트워크 및 시간대 불일치
- **문제**: 백엔드 컨테이너가 MySQL 컨테이너를 `localhost`로 찾으면서 `Connection refused` 발생. 이후 Docker 네트워크로 연결했지만, 컨테이너 시간대가 기본값(UTC)으로 설정되어 있어 실제 시각과 9시간 차이나는 문제 발생.
- **해결**: 두 컨테이너를 동일한 Docker 네트워크(`taskmanager-net`)에 연결하고, JVM 옵션(`-Duser.timezone=Asia/Seoul`)과 MySQL 컨테이너 실행 옵션(`--default-time-zone='+09:00'`)으로 시간대를 통일.

### 3. CORS 설정 누락으로 인한 405 에러
- **문제**: 프론트(`localhost:5173`)에서 백엔드(`localhost:8080`)로 요청 시 브라우저의 CORS preflight(OPTIONS) 요청이 Spring Security에서 처리되지 않아 405 Method Not Allowed 발생. `curl`로는 정상 동작해 브라우저 전용 이슈임을 확인.
- **해결**: `SecurityConfig`에 `CorsConfigurationSource` Bean을 등록하고 `securityFilterChain`에 `.cors(...)`를 연결.

### 4. JWT 필터의 예외 미처리로 인한 500/405 에러
- **문제**: 만료되었거나 유저가 삭제된 토큰이 요청에 포함되면 `JwtAuthFilter`가 `UsernameNotFoundException`을 던지고, 이 예외가 필터 체인에서 처리되지 않아 `/error`로 재전달되며 원래 요청의 HTTP 메서드가 지원되지 않는다는 405 에러로 변질됨.
- **해결**: `JwtAuthFilter` 내에서 인증 처리 부분을 try-catch로 감싸 예외 발생 시 조용히 익명 상태로 다음 필터로 넘어가도록 수정.

### 5. WebSocket 인증 토큰 미전달로 인한 알림 미수신
- **문제**: 프론트에서 WebSocket 연결 시 인증 토큰을 URL에 포함하지 않아, 서버의 `WebSocketAuthInterceptor`가 핸드셰이크를 거부. 또한 토큰이 없을 때 `List.of(null)` 호출로 NPE가 발생해 연결이 예기치 않게 끊김.
- **해결**: 프론트에서 연결 시 `?token=` 쿼리 파라미터로 토큰을 전달하도록 수정하고, 서버 측 토큰 추출 로직을 배열 기반으로 변경해 null 안전성 확보.

### 6. 할 일 수정 시 알림 미발송
- **문제**: 할 일 생성/완료 시에는 WebSocket 알림이 발송됐지만, 수정(`updateTask`) API에는 알림 발송 로직이 누락되어 있었음.
- **해결**: `TaskController.updateTask`에 알림 발송 코드를 추가.

### 7. API 응답 누락으로 인한 프론트 상태 불일치
- **문제**: `taskApi.js`의 `updateTask`, `completeTask` 함수가 서버 응답을 반환하지 않아, 전역 상태(`TaskContext`)에 `undefined` 값이 섞여 들어감. 이로 인해 캘린더 렌더링 시 `Cannot read properties of undefined` 에러가 발생하고, 완료 처리 시 완료일자가 새로고침 전까지 반영되지 않는 문제가 있었음.
- **해결**: 두 함수 모두 `response.data`를 반환하도록 수정.

### 8. 로그인 없이도 반복 실행되는 인증 체크로 인한 무한 리다이렉트
- **문제**: `TaskContext`의 데이터 조회가 로그인 여부와 무관하게 무조건 실행되고, 401 응답 시 `logout()`이 이미 로그인 페이지에 있어도 무조건 페이지를 새로고침하도록 되어 있어 무한 리다이렉트 루프가 발생.
- **해결**: `TaskContext`가 인증된 사용자(`user`)가 있을 때만 데이터를 조회하도록 조건을 추가하고, `logout()` 함수들에 현재 경로가 `/login`이 아닐 때만 리다이렉트하도록 가드 추가.

### 9. 환경변수를 통한 민감 정보 분리
- **문제**: `application.yml`에 Google OAuth client secret, DB 비밀번호, JWT secret이 평문으로 포함되어 있었음.
- **해결**: 각 값을 환경변수(`${GOOGLE_CLIENT_SECRET}` 등)로 분리하고, 실제 값은 `.env` 파일에서 관리하도록 변경. `.env`는 `.gitignore`에 등록해 버전 관리에서 제외.

### 10. 마감기한 및 캘린더 연동
- **문제**: 할 일에 마감기한을 설정할 수 없었고, 마감기한이 없는 할 일은 캘린더에 아예 표시되지 않는 문제가 있었음.
- **해결**: 할 일 생성/수정 폼에 마감기한 입력을 추가하고, 마감기한이 없는 항목은 생성일을 기준으로 캘린더에 표시하도록 수정. 상태(진행중/완료됨/대기중)에 따라 캘린더 이벤트 색상을 다르게 표시하고, 마감기한이 임박한 할 일에 대해 스케줄러 기반 알림을 발송하도록 구현.