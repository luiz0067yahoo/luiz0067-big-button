/**
 * luiz0067 Big Button - Gutenberg Custom Block
 * 
 * Bloco Gutenberg customizado para Botões Grandes (Big Button) com suporte de 1 a 5 botões por linha,
 * links internos/externos, alinhamento flexível, cores personalizadas e total compatibilidade retroativa
 * com o bloco legado cms-adm/big-button do projeto Prefeitura / customADM.
 *
 * @package Luiz0067_Big_Button
 * @version 1.0.0
 */

(function (blocks, element, blockEditor, components, i18n) {
	'use strict';

	if (!blocks || !element || !blocks.registerBlockType) {
		return;
	}

	var el = element.createElement;
	var registerBlockType = blocks.registerBlockType;
	var __ = function (text, domain) {
		if (i18n && typeof i18n.__ === 'function') {
			var translated = i18n.__(text, domain || 'luiz0067-big-button');
			if (translated && translated !== text) {
				return translated;
			}
		}
		if (window.luiz0067BigButtonI18n && window.luiz0067BigButtonI18n[text]) {
			return window.luiz0067BigButtonI18n[text];
		}
		return text;
	};

	// Referências seguras para módulos do editor e componentes Gutenberg
	var editor = blockEditor || window.wp.editor || {};
	var RichText = editor.RichText;
	var InspectorControls = editor.InspectorControls;
	var BlockControls = editor.BlockControls;
	var AlignmentToolbar = editor.AlignmentToolbar || editor.BlockAlignmentToolbar;

	var comps = components || window.wp.components || {};
	var PanelBody = comps.PanelBody;
	var PanelRow = comps.PanelRow;
	var TextControl = comps.TextControl;
	var SelectControl = comps.SelectControl;
	var ToggleControl = comps.ToggleControl;
	var RangeControl = comps.RangeControl;
	var ColorPalette = comps.ColorPalette;
	var Button = comps.Button;
	var Tooltip = comps.Tooltip;

	// Ícone personalizado SVG para o bloco
	var buttonIcon = el('svg', {
		width: 24,
		height: 24,
		viewBox: '0 0 24 24',
		xmlns: 'http://www.w3.org/2000/svg'
	},
		el('rect', { x: 2, y: 5, width: 20, height: 6, rx: 2, fill: '#01913a' }),
		el('rect', { x: 2, y: 13, width: 20, height: 6, rx: 2, fill: '#333333' })
	);

	// Paleta de cores com destaque para a cor institucional prefeitura (#01913a)
	var colorPaletteList = [
		{ name: __('Verde Institucional', 'luiz0067-big-button'), color: '#01913a' },
		{ name: __('Verde Escuro', 'luiz0067-big-button'), color: '#006828' },
		{ name: __('Verde Esmeralda', 'luiz0067-big-button'), color: '#10b981' },
		{ name: __('Grafite Escuro', 'luiz0067-big-button'), color: '#333333' },
		{ name: __('Azul', 'luiz0067-big-button'), color: '#57a7ed' },
		{ name: __('Azul Escuro', 'luiz0067-big-button'), color: '#233e95' },
		{ name: __('Coral / Vermelho', 'luiz0067-big-button'), color: '#f08f86' },
		{ name: __('Dourado / Amarelo', 'luiz0067-big-button'), color: '#e5b624' },
		{ name: __('Cinza Claro', 'luiz0067-big-button'), color: '#f5f5f5' },
		{ name: __('Branco', 'luiz0067-big-button'), color: '#ffffff' }
	];

	// Normaliza e obtém o array de botões a partir dos atributos (modernos ou legados)
	function getNormalizedButtons(attributes) {
		if (attributes.buttons && Array.isArray(attributes.buttons) && attributes.buttons.length > 0) {
			return attributes.buttons;
		}

		// Fallback compatível com atributos legados (title: array, url: array) do cms-adm/big-button
		if (attributes.title && Array.isArray(attributes.title) && attributes.title.length > 0) {
			var legacyList = [];
			for (var i = 0; i < attributes.title.length; i++) {
				legacyList.push({
					title: attributes.title[i] || '',
					url: (attributes.url && attributes.url[i]) ? attributes.url[i] : '',
					targetBlank: false
				});
			}
			return legacyList;
		}

		// Padrão inicial com 1 botão
		return [
			{
				title: __('Clique Aqui', 'luiz0067-big-button'),
				url: '',
				targetBlank: false
			}
		];
	}

	// Sincroniza tanto a lista moderna 'buttons' quanto os atributos legados 'title' e 'url'
	function syncButtons(props, newButtons) {
		var titles = [];
		var urls = [];
		for (var i = 0; i < newButtons.length; i++) {
			titles.push(newButtons[i].title || '');
			urls.push(newButtons[i].url || '');
		}

		props.setAttributes({
			buttons: newButtons,
			title: titles,
			url: urls
		});
	}

	// Definição dos atributos do bloco
	var blockAttributes = {
		buttons: {
			type: 'array',
			default: [
				{
					title: 'Botão 1',
					url: '',
					targetBlank: false
				}
			]
		},
		// Atributos legados mantidos para compatibilidade com posts existentes
		title: {
			type: 'array',
			default: ['Botão 1']
		},
		url: {
			type: 'array',
			default: ['']
		},
		alignment: {
			type: 'string',
			default: 'center'
		},
		buttonStyle: {
			type: 'string',
			default: 'default' // 'default', 'institutional', 'outline', 'pill'
		},
		columns: {
			type: 'number',
			default: 0 // 0 = fluído / auto, 1 a 5
		},
		customBgColor: {
			type: 'string',
			default: ''
		},
		customTextColor: {
			type: 'string',
			default: ''
		}
	};

	// Configuração do Bloco
	var blockDefinition = {
		title: __('Botões Grandes', 'luiz0067-big-button'),
		description: __('Quantidade de até 5 botões por linha com links e estilos personalizáveis.', 'luiz0067-big-button'),
		icon: buttonIcon,
		category: 'design',
		keywords: [
			__('botão', 'luiz0067-big-button'),
			__('botões', 'luiz0067-big-button'),
			__('big button', 'luiz0067-big-button'),
			__('links', 'luiz0067-big-button'),
			__('custom adm', 'luiz0067-big-button')
		],
		supports: {
			multiple: true,
			align: ['left', 'center', 'right', 'wide', 'full'],
			html: false
		},
		attributes: blockAttributes,

		/**
		 * Renderização do bloco dentro do editor Gutenberg
		 */
		edit: function (props) {
			var attributes = props.attributes;
			var buttons = getNormalizedButtons(attributes);
			var alignment = attributes.alignment || 'center';
			var buttonStyle = attributes.buttonStyle || 'default';
			var columns = attributes.columns || 0;
			var customBgColor = attributes.customBgColor || '';
			var customTextColor = attributes.customTextColor || '';

			// Estado local para controle do formulário popover/inline de URL por índice
			var activeLinkIndex = props.stateLinkIndex !== undefined ? props.stateLinkIndex : null;

			// Atualiza o título de um botão específico
			function onUpdateTitle(index, newTitle) {
				var updated = buttons.slice(0);
				updated[index] = Object.assign({}, updated[index], { title: newTitle });
				syncButtons(props, updated);
			}

			// Atualiza a URL de um botão específico
			function onUpdateUrl(index, newUrl) {
				var updated = buttons.slice(0);
				updated[index] = Object.assign({}, updated[index], { url: newUrl });
				syncButtons(props, updated);
			}

			// Alterna a opção "Abrir em nova aba"
			function onToggleTargetBlank(index, val) {
				var updated = buttons.slice(0);
				updated[index] = Object.assign({}, updated[index], { targetBlank: val });
				syncButtons(props, updated);
			}

			// Adiciona um novo botão (limite máximo: 5 botões por linha)
			function onAddButton(afterIndex) {
				if (buttons.length >= 5) {
					return;
				}
				var updated = buttons.slice(0);
				var insertAt = (typeof afterIndex === 'number') ? afterIndex + 1 : updated.length;
				updated.splice(insertAt, 0, {
					title: __('Novo Botão', 'luiz0067-big-button'),
					url: '',
					targetBlank: false
				});
				syncButtons(props, updated);
			}

			// Remove um botão (mínimo: 1 botão)
			function onRemoveButton(index) {
				if (buttons.length <= 1) {
					return;
				}
				var updated = buttons.slice(0);
				updated.splice(index, 1);
				syncButtons(props, updated);
			}

			// Renderiza controles da barra de ferramentas superior (BlockControls)
			var blockControlsNode = null;
			if (BlockControls) {
				blockControlsNode = el(
					BlockControls,
					null,
					AlignmentToolbar && el(AlignmentToolbar, {
						value: alignment,
						onChange: function (newAlign) {
							props.setAttributes({ alignment: newAlign || 'center' });
						}
					})
				);
			}

			// Renderiza os controles da barra lateral (InspectorControls)
			var inspectorControlsNode = null;
			if (InspectorControls) {
				inspectorControlsNode = el(
					InspectorControls,
					null,

					// Painel 1: Configurações de Layout e Estilo
					el(
						PanelBody,
						{
							title: __('Configurações dos Botões', 'luiz0067-big-button'),
							initialOpen: true
						},
						SelectControl && el(SelectControl, {
							label: __('Alinhamento', 'luiz0067-big-button'),
							value: alignment,
							options: [
								{ label: __('Esquerda', 'luiz0067-big-button'), value: 'left' },
								{ label: __('Centralizado', 'luiz0067-big-button'), value: 'center' },
								{ label: __('Direita', 'luiz0067-big-button'), value: 'right' }
							],
							onChange: function (val) {
								props.setAttributes({ alignment: val });
							}
						}),
						SelectControl && el(SelectControl, {
							label: __('Colunas por Linha', 'luiz0067-big-button'),
							value: columns,
							options: [
								{ label: __('Automático / Adaptativo (até 5)', 'luiz0067-big-button'), value: 0 },
								{ label: __('1 Coluna (Largura Total)', 'luiz0067-big-button'), value: 1 },
								{ label: __('2 Colunas', 'luiz0067-big-button'), value: 2 },
								{ label: __('3 Colunas', 'luiz0067-big-button'), value: 3 },
								{ label: __('4 Colunas', 'luiz0067-big-button'), value: 4 },
								{ label: __('5 Colunas', 'luiz0067-big-button'), value: 5 }
							],
							onChange: function (val) {
								props.setAttributes({ columns: parseInt(val, 10) });
							}
						}),
						SelectControl && el(SelectControl, {
							label: __('Estilo Visual', 'luiz0067-big-button'),
							value: buttonStyle,
							options: [
								{ label: __('Padrão Branco Institucional', 'luiz0067-big-button'), value: 'default' },
								{ label: __('Verde Institucional (#01913a)', 'luiz0067-big-button'), value: 'institutional' },
								{ label: __('Contorno (Outline)', 'luiz0067-big-button'), value: 'outline' },
								{ label: __('Bordas Arredondadas (Pill)', 'luiz0067-big-button'), value: 'pill' }
							],
							onChange: function (val) {
								props.setAttributes({ buttonStyle: val });
							}
						})
					),

					// Painel 2: Links e Destinos de cada botão
					el(
						PanelBody,
						{
							title: __('Links dos Botões', 'luiz0067-big-button'),
							initialOpen: false
						},
						buttons.map(function (btn, idx) {
							return el(
								'div',
								{
									key: 'link-ctrl-' + idx,
									className: 'luiz0067-inspector-btn-item'
								},
								el('p', { className: 'luiz0067-inspector-btn-label' },
									el('strong', null, __('Botão ', 'luiz0067-big-button') + (idx + 1) + ': '),
									btn.title || __('(Sem texto)', 'luiz0067-big-button')
								),
								TextControl && el(TextControl, {
									label: __('URL / Destino do Link', 'luiz0067-big-button'),
									value: btn.url || '',
									placeholder: 'https://exemplo.com.br',
									onChange: function (val) {
										onUpdateUrl(idx, val);
									}
								}),
								ToggleControl && el(ToggleControl, {
									label: __('Abrir link em nova aba (_blank)', 'luiz0067-big-button'),
									checked: !!btn.targetBlank,
									onChange: function (val) {
										onToggleTargetBlank(idx, val);
									}
								}),
								el('hr', { className: 'luiz0067-inspector-separator' })
							);
						})
					),

					// Painel 3: Cores Personalizadas
					ColorPalette && el(
						PanelBody,
						{
							title: __('Cores Personalizadas', 'luiz0067-big-button'),
							initialOpen: false
						},
						el('p', null, __('Cor de Fundo do Botão:', 'luiz0067-big-button')),
						el(ColorPalette, {
							colors: colorPaletteList,
							value: customBgColor,
							onChange: function (color) {
								props.setAttributes({ customBgColor: color || '' });
							}
						}),
						el('p', null, __('Cor do Texto:', 'luiz0067-big-button')),
						el(ColorPalette, {
							colors: colorPaletteList,
							value: customTextColor,
							onChange: function (color) {
								props.setAttributes({ customTextColor: color || '' });
							}
						})
					)
				);
			}

			// Constrói as classes CSS do container do editor
			var containerClass = 'block big-button luiz0067-big-button-editor big-button-align-' + alignment;
			if (columns > 0) {
				containerClass += ' big-button-cols-' + columns;
			}

			// Renderiza cada botão na área de edição
			var editorButtons = buttons.map(function (btn, index) {
				var buttonItemClass = 'btn-btn btn-style-' + buttonStyle;
				var customStyle = {};
				if (customBgColor) {
					customStyle.backgroundColor = customBgColor;
				}
				if (customTextColor) {
					customStyle.color = customTextColor;
				}

				return el(
					'div',
					{
						key: 'btn-item-' + index,
						className: 'editor-btn-wrapper'
					},
					// Botão visual com texto editável inline
					el(
						'div',
						{
							className: buttonItemClass,
							style: customStyle
						},
						el(RichText, {
							tagName: 'span',
							className: 'rich-text btn-text',
							multiline: false,
							placeholder: __('Texto do botão...', 'luiz0067-big-button'),
							value: btn.title,
							onChange: function (newTitle) {
								onUpdateTitle(index, newTitle);
							}
						})
					),

					// Barra de ferramentas inline de ação para cada botão
					el(
						'div',
						{ className: 'editor-big-button-actions' },

						// Campo de URL rápida inline
						el('input', {
							type: 'text',
							className: 'link-quick-input',
							placeholder: __('Link URL (https://...)', 'luiz0067-big-button'),
							value: btn.url || '',
							onChange: function (e) {
								onUpdateUrl(index, e.target.value);
							},
							title: __('Destino do Link', 'luiz0067-big-button')
						}),

						// Botão para remover este botão
						(buttons.length > 1) ? el('button', {
							type: 'button',
							className: 'editor-action-btn btn-remove',
							title: __('Remover Botão', 'luiz0067-big-button'),
							'aria-label': __('Remover Botão', 'luiz0067-big-button'),
							onClick: function () {
								onRemoveButton(index);
							}
						}, '-') : null,

						// Botão para adicionar botão seguinte (máximo 5)
						(buttons.length < 5) ? el('button', {
							type: 'button',
							className: 'editor-action-btn btn-add',
							title: __('Adicionar Botão (até 5)', 'luiz0067-big-button'),
							'aria-label': __('Adicionar Botão', 'luiz0067-big-button'),
							onClick: function () {
								onAddButton(index);
							}
						}, '+') : null
					)
				);
			});

			return el(
				'div',
				{ className: 'luiz0067-big-button-container' },
				blockControlsNode,
				inspectorControlsNode,
				el('div', { className: containerClass }, editorButtons)
			);
		},

		/**
		 * Renderização para persistência HTML no banco de dados (Frontend)
		 */
		save: function (props) {
			var attributes = props.attributes;
			var buttons = getNormalizedButtons(attributes);
			var alignment = attributes.alignment || 'center';
			var buttonStyle = attributes.buttonStyle || 'default';
			var columns = attributes.columns || 0;
			var customBgColor = attributes.customBgColor || '';
			var customTextColor = attributes.customTextColor || '';

			var containerClasses = 'block big-button big-button-align-' + alignment;
			if (columns > 0) {
				containerClasses += ' big-button-cols-' + columns;
			}

			var savedButtons = buttons.map(function (btn, index) {
				var itemClasses = 'btn-btn btn-style-' + buttonStyle;
				var customStyle = {};
				if (customBgColor) {
					customStyle.backgroundColor = customBgColor;
				}
				if (customTextColor) {
					customStyle.color = customTextColor;
				}

				var linkAttrs = {
					key: 'saved-btn-' + index,
					className: itemClasses,
					href: btn.url ? btn.url : '#',
					role: 'button'
				};

				if (Object.keys(customStyle).length > 0) {
					linkAttrs.style = customStyle;
				}

				if (btn.targetBlank) {
					linkAttrs.target = '_blank';
					linkAttrs.rel = 'noopener noreferrer';
				}

				return el(
					'a',
					linkAttrs,
					el(RichText.Content, {
						tagName: 'span',
						className: 'rich-text btn-text',
						value: btn.title
					})
				);
			});

			return el('div', { className: containerClasses }, savedButtons);
		},

		/**
		 * Migração automática para posts criados pelo formato legado cms-adm/big-button
		 */
		deprecated: [
			{
				attributes: {
					title: { type: 'array' },
					url: { type: 'array' }
				},
				save: function (props) {
					var sizelines = (props.attributes.title && props.attributes.title.length) || 0;
					var lines_save = [];
					for (var index = 0; index < sizelines; index++) {
						lines_save.push(
							el('a', {
								key: index,
								className: 'btn-btn',
								href: (props.attributes.url && props.attributes.url[index]) ? props.attributes.url[index] : '#'
							},
								el('div', { className: 'rich-text' }, props.attributes.title[index])
							)
						);
					}
					return el('div', { className: 'block big-button' }, lines_save);
				},
				migrate: function (attributes) {
					var titles = attributes.title || [];
					var urls = attributes.url || [];
					var newButtons = [];
					for (var i = 0; i < titles.length; i++) {
						newButtons.push({
							title: titles[i] || '',
							url: (urls[i]) ? urls[i] : '',
							targetBlank: false
						});
					}
					return Object.assign({}, attributes, {
						buttons: newButtons,
						alignment: 'center',
						buttonStyle: 'default'
					});
				}
			}
		]
	};

	// 1. Registro oficial moderno com namespace luiz0067
	registerBlockType('luiz0067/big-button', blockDefinition);

	// 2. Registro de retrocompatibilidade para o namespace cms-adm caso o tema/plugin antigo solicite
	if (!blocks.getBlockType('cms-adm/big-button')) {
		registerBlockType('cms-adm/big-button', blockDefinition);
	}

})(
	window.wp.blocks,
	window.wp.element,
	window.wp.blockEditor || window.wp.editor,
	window.wp.components,
	window.wp.i18n
);
