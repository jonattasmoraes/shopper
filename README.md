# Back-End Service for Water and Gas Consumption Management

Este serviço back-end é responsável por gerenciar a leitura individualizada do consumo de água e gás. Utilizando IA para obter medições através de imagens de medidores, o serviço inclui endpoints para:

- Upload de imagens e obtenção de medições via API.
- Confirmação ou correção dos valores lidos.
- Listagem de medições realizadas para um cliente específico.

## Funcionalidades

- **POST /upload**: Recebe uma imagem em base64, consulta o Gemini e retorna a medição lida pela API.
- **PATCH /confirm**: Confirma ou corrige o valor lido pelo LLM.
- **GET /<customer_code>/list**: Lista todas as medições realizadas por um cliente com a opção de usar um parâmetro.

## Requisitos

- [Docker](https://www.docker.com/get-started) instalado na máquina

## Tecnologias Utilizadas

- Back-End: Node.js, TypeScript
- Banco de Dados: PostgreSQL (já configurado no Docker Compose)
- Docker: Para containerização da aplicação
- Swagger: Para documentação e testes da API
- Versionamento: Git

## Executando o Projeto

1. Clone o repositório:

    ```sh
    git clone https://github.com/seu-usuario/seu-repositorio.git
    ```

2. Navegue até o diretório do projeto:

    ```sh
    cd seu-repositorio
    ```

3. Configure o arquivo .env na raiz do projeto com a variável
   `GEMINI_API_KEY`:

    ```sh
    GEMINI_API_KEY=<sua_chave_da_api>
    ```

4. Execute a aplicação com Docker Compose:

    ```sh
    docker-compose up --build
    ```

## Uso

### POST /upload

**Corpo da Requisição**

    ```json
    {
      "image": "base64",
      "customer_code": "string",
      "measure_datetime": "datetime",
      "measure_type": "WATER" ou "GAS"
    }
    ```

**Response Body (200 OK):**

    ```json
    {
      "image_url": "string",
      "measure_value": 100,
      "measure_uuid": "some-uuid"
    }
    ```

**Response Body (Error: 400, 409 e 500):**

    ```json
    {
      "error_code": "INVALID_DATA",
      "error_description": "Descrição do erro"
    }
    ```

### PATCH /confirm

**Corpo da Requisição**

    ```json
    {
      "measure_uuid": "string",
      "confirmed_value": integer
    }
    ```

**Response Body (200 OK):**

    ```json
    {
      "success": true
    }
    ```

**Response Body (Error: 400, 404, 409 e 500):**

    ```json
    {
      "error_code": "INVALID_DATA",
      "error_description": "Descrição do erro"
    }
    ```

### GET /<customer_code>/list

**Corpo da Requisição**

*Query Parameters*

- measure_type (opcional): "WATER" ou "GAS"

**Response Body (200 OK):**

    ```json
    {
      "customer_code": "string",
      "measures": [
        {
          "measure_uuid": "string",
          "measure_datetime": "datetime",
          "measure_type": "string",
          "has_confirmed": true,
          "image_url": "string"
        }
      ]
    }
    ```

**Response Body (Error: 400, 404 e 500):**

    ```json
    {
      "error_code": "INVALID_DATA",
      "error_description": "Descrição do erro"
    }
    ```

## Testes

Para executar os testes, utilize o seguinte comando:

    ```bash
    npm test
    ```

## Swagger

A API possui documentação Swagger acessível em [http://localhost:3000/api-docs/#/](http://localhost:3000/api-docs/#/), onde `{PORT}` é a porta configurada no `.env` ou no `docker-compose.yml`.
