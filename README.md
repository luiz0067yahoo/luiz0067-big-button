# luiz0067 Big Button 🔘

[![WordPress](https://img.shields.io/badge/WordPress-6.0%2B-blue.svg?logo=wordpress)](https://wordpress.org)
[![PHP](https://img.shields.io/badge/PHP-7.4%2B-777bb4.svg?logo=php)](https://php.net)
[![Gutenberg](https://img.shields.io/badge/Gutenberg-Blocks-black.svg?logo=wordpress)](https://wordpress.org/gutenberg/)
[![License: GPL v2+](https://img.shields.io/badge/License-GPL%20v2%2B-green.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

Plugin WordPress completo e autossuficiente que adiciona um Custom Block Gutenberg moderno e flexível para **Botões Grandes (Big Button)** (`luiz0067/big-button`), com suporte nativo a até 5 botões por linha, links rápidos, estilos visuais customizáveis e total compatibilidade retroativa com o bloco legado `cms-adm/big-button` e a classe `.btn-btn`.

![Demonstração luiz0067 Big Button](screenshot.png)

---

## 📌 Sobre o Plugin

Desenvolvido para portais institucionais, governamentais, prefeituras e websites corporativos que necessitam de botões de destaque, acesso rápido e navegação em grade, o **luiz0067 Big Button** oferece uma experiência visual limpa e fluida dentro do editor Gutenberg.

O plugin preserva o clássico padrão visual com destaque para o verde institucional da prefeitura (`#01913a`), mantendo as classes legadas `.big-button` e `.btn-btn`, além de permitir adicionar e remover botões dinamicamente (de 1 a 5 por linha) diretamente na área de edição visual ou pelo painel lateral.

---

## 📸 Screenshots

| 🎨 Painel de Edição no Gutenberg (WYSIWYG) | 🌐 Visualização Pública no Front-end |
| :---: | :---: |
| [![Editor Gutenberg](assets/screenshot-1.png)](assets/screenshot-1.png) | [![Frontend Público](assets/screenshot-2.png)](assets/screenshot-2.png) |
| *Edição rápida inline com inputs de URL e barra lateral de estilos* | *Renderização responsiva dos botões com destaque e hover institucional* |

---

## 🚀 Principais Recursos

- **Fidelidade Visual 100% WYSIWYG**: Edição interativa no editor Gutenberg idêntica à renderização no front-end público.
- **De 1 a 5 Botões por Linha**:
  - Layout flexível adaptativo ou com controle estrito de colunas (1 a 5 colunas).
  - Adicione (`+`) ou remova (`-`) botões com um único clique no canvas visual.
- **Estilo Clássico Institucional (`.btn-btn`)**:
  - Totalmente compatível com temas legados da prefeitura e regras CSS antigas (`Custom.css`).
  - Efeito hover dinâmico no verde institucional `#01913a` com elevação e sombra suave.
- **Múltiplos Estilos Visuais**:
  - 🏛️ **Padrão Branco Institucional**: Fundo branco com borda sutil e hover verde.
  - 🌿 **Verde Institucional**: Botão sólido na cor verde prefeitura (`#01913a`) com hover escuro (`#006828`).
  - 🔲 **Contorno (Outline)**: Fundo transparente com borda colorida elegante.
  - 💊 **Bordas Arredondadas (Pill)**: Formato oval/pílula moderno.
- **Configurações Completas na Barra Lateral (InspectorControls)**:
  - **Alinhamento**: Esquerda, Centralizado ou Direita.
  - **Colunas**: Escolha entre modo automático/adaptativo ou grade fixa de 1 a 5 colunas.
  - **Links e Destinos**: Controle individual de URL para cada botão e opção de abrir em nova aba (`target="_blank"`).
  - **Paleta de Cores**: Cores personalizadas de fundo e texto com presets institucionais.
- **Compatibilidade Retroativa Total**:
  - Registra o namespace oficial `luiz0067/big-button` e mapeia automaticamente `cms-adm/big-button`.
  - Migração de atributos transparente através da API `deprecated` do Gutenberg, evitando erros de bloco inválido.
- **Zero Build Step (Vanilla ES5)**:
  - 100% desenvolvido em JavaScript Vanilla ES5 nativo do WordPress (`wp.element.createElement`, `wp.blocks.registerBlockType`). Não requer Node.js, Webpack, Babel nem compilação de pacotes.
- **Internacionalização Completa (i18n)**:
  - Preparado para tradução com Text Domain `luiz0067-big-button`.
  - Suporte nativo completo a **Português do Brasil (`pt_BR`)**, **Inglês (`en_US`)**, **Espanhol (`es_ES`)** e **Italiano (`it_IT`)**, com arquivos `.po`, `.mo` e `.json` para o editor Gutenberg (`wp_set_script_translations`).

---

## 📁 Estrutura do Projeto

```text
luiz0067-big-button/
├── luiz0067-big-button.php     # Arquivo principal do plugin (registro, enqueues e textdomain)
├── languages/                  # Internacionalização (i18n): pt_BR, en_US, es_ES, it_IT
│   ├── luiz0067-big-button.pot
│   ├── luiz0067-big-button-pt_BR.po / .mo / pt-br.json
│   ├── luiz0067-big-button-en_US.po / .mo / en.json / *.json
│   ├── luiz0067-big-button-es_ES.po / .mo / es.json / *.json
│   └── luiz0067-big-button-it_IT.po / .mo / it.json / *.json
├── assets/
│   ├── js/
│   │   └── block.js           # Lógica do bloco Gutenberg (ES5 / wp.element.createElement)
│   ├── css/
│   │   ├── editor.css         # Estilos específicos do editor Gutenberg
│   │   └── style.css          # Estilos do front-end público e canvas
│   ├── screenshot-1.png       # Captura de tela da edição no Gutenberg
│   └── screenshot-2.png       # Captura de tela do resultado no front-end
├── screenshot.png             # Imagem de demonstração / banner visual do projeto
├── readme.txt                  # Metadados oficiais WordPress.org
└── README.md                  # Documentação completa
```

---

## 💻 Instalação

### Opção 1: Via Painel do WordPress
1. Baixe a pasta ou o arquivo `.zip` do repositório.
2. No painel administrativo do WordPress, vá em **Plugins > Adicionar Novo > Enviar Plugin**.
3. Selecione o arquivo e clique em **Instalar Agora**.
4. Clique em **Ativar Plugin**.

### Opção 2: Manualmente via FTP ou Pasta de Plugins
1. Copie a pasta `luiz0067-big-button` para o diretório de plugins:
   ```bash
   wp-content/plugins/luiz0067-big-button/
   ```
2. Acesse o painel do WordPress em **Plugins > Plugins Instalados** e ative **luiz0067 Big Button**.

---

## 🎯 Como Usar no Editor Gutenberg

1. Abra ou crie uma Página ou Post no Gutenberg.
2. Clique no botão **`+` (Adicionar Bloco)**.
3. Digite **Botões Grandes** ou **big button**.
4. Insira o bloco na página.
5. Edite o texto de cada botão diretamente no canvas visual.
6. Digite a URL no campo inline de link rápido ou utilize o painel lateral (**Bloco**):
   - Alterne o alinhamento (Esquerda, Centro, Direita).
   - Ajuste o número de colunas por linha (até 5).
   - Defina estilos (Padrão, Institucional, Outline ou Pill).
   - Adicione novos botões com o botão `+` ou remova com `-`.
7. Salve ou publique o conteúdo.

---

## ⚙️ Compatibilidade Técnica

| Recurso | Suporte |
| :--- | :--- |
| **Versão Mínima do WordPress** | 6.0+ |
| **Versão Testada do WordPress** | até 7.1 |
| **Versão do PHP** | 7.4 ou superior (PHP 8.0, 8.1, 8.2 e 8.3) |
| **Block Themes (FSE)** | Sim (suporte a `editor-styles` e `add_editor_style`) |
| **Classic Themes** | Sim |
| **Namespace Oficial** | `luiz0067/big-button` |
| **Namespace Legado** | `cms-adm/big-button` |
| **Classes CSS Legadas** | `.block.big-button`, `.btn-btn` |
| **Internacionalização (i18n)** | Sim (`pt_BR`, `en_US`, `es_ES`, `it_IT`) |

---

## 📄 Licença

Este projeto é software livre e está licenciado sob os termos da licença [GNU General Public License v2.0 or later (GPL-2.0-or-later)](https://www.gnu.org/licenses/gpl-2.0.html).

---

## 👨‍💻 Autor

**Luiz Fernando Brogliatto Ferreira**
- WordPress.org: [@luiz0067](https://profiles.wordpress.org/luiz0067/)
- GitHub: [@luiz0067yahoo](https://github.com/luiz0067yahoo)
- LinkedIn: [Luiz Fernando Brogliatto Ferreira](https://www.linkedin.com/in/luiz-ferreira-260277379/)
