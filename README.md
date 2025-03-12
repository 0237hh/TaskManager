# TaskManager
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

## :lock: 라이센스

MIT 라이센스
