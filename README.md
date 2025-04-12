# Green Acesso - Desafio Técnico Backend

Este repositório contém a implementação completa do desafio técnico backend proposto pela **Green Acesso**, com foco em importação de boletos via CSV/PDF, persistência em banco de dados e geração de relatórios em PDF.

##  Entregas Realizadas

O projeto contempla **100% das atividades propostas**:

| Atividade | Descrição | Status |
|----------|-----------|--------|
| 1 | Importação de `.csv` com boletos |  Concluído |
| 2 | Mapeamento da unidade externa (`unidade`) para o `id` do lote interno |  Concluído |
| 3| Upload e divisão de PDF com boletos individuais |  Concluído |
| 4 | Listagem com filtros (`nome`, `valor_inicial`, `valor_final`, `id_lote`) |  Concluído |
| 5 | Geração de relatório PDF e retorno via Base64 |  Concluído |

---

##  Arquitetura e Boas Práticas

O projeto foi estruturado com foco em clareza, escalabilidade e manutenção a longo prazo. Algumas práticas e padrões adotados:

###  Arquitetura Hexagonal
- Separação entre camadas de **domínio**, **casos de uso** (application) e **infraestrutura**.
- Acesso a banco de dados feito por meio de **repositórios desacoplados** da lógica de negócio.

###  Value Objects
- Campos como `Nome`, `Valor`, `LinhaDigitavel`, `Status`, `Lote` e `Data` encapsulam regras de domínio e validações.

###  Result Pattern (Right / Left)
- Todos os métodos críticos usam `Result<Left, Right>` como estratégia de tratamento seguro de erros, inspirado em FP (functional programming) e Rust.

###  DTOs + Inputs
- Os dados de entrada e saída estão fortemente tipados com uso de `DTOs` e `inputs` validados, garantindo consistência entre as camadas.

###  Upload seguro de arquivos
- Uploads são validados com:
  - Interceptors para **extensão e MIME type**
  - Armazenamento em pasta temporária (`/tmp/boletos`)
  - Logs de sucesso ou erro para rastreabilidade

###  Geração de Relatório em PDF
- Utilizado o `pdfkit` para geração de relatórios de boletos com conteúdo estruturado.
- Relatório retornado via `base64` conforme solicitado.

###  Teste Manual
- Os endpoints foram testados com Postman para os seguintes fluxos:
  - Upload do CSV (`POST /boletos/upload-csv`)
  - Upload do PDF com várias páginas (`POST /boletos/upload-pdf`)
  - Listagem com filtros (`GET /boletos?nome=MAR&...`)
  - Geração de relatório PDF (`GET /boletos?relatorio=1`)

---

## Considerações de Segurança

- Interceptors para bloquear uploads inválidos por tipo e extensão
- Logs estruturados com `pino`, sem exposição de dados sensíveis
- Sanitização de dados (em especial `linha_digitavel`, `nome`, `valor`)
- Arquivos temporários são armazenados fora da pasta pública

---

## Observação Final

O projeto possui uma estrutura que pode parecer "robusta demais" para o escopo do desafio, mas essa foi uma escolha consciente para demonstrar domínio técnico, boas práticas e atenção a detalhes que seriam aplicados em projetos maiores.

Mesmo sendo um projeto pequeno, mostrar desde o início que pensamos em legibilidade, consistência, validação e separação de responsabilidades é uma forma de comunicar maturidade e prontidão para desafios mais complexos.

##  Finalizado

Agradeço a oportunidade de participar do desafio. Caso tenham qualquer dúvida sobre a estrutura do projeto ou decisões técnicas, estou à disposição para conversar na entrevista.

