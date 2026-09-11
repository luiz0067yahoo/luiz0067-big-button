<?php
/**
 * Plugin Name:       luiz0067 Big Button
 * Plugin URI:        https://github.com/luiz0067yahoo/luiz0067-big-button
 * Description:       WordPress Gutenberg Block para Botões Grandes (Big Button) com suporte de até 5 botões por linha, links internos e externos, alinhamento flexível, estilos customizáveis e total compatibilidade retroativa com cms-adm/big-button.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Tested up to:      7.1
 * Requires PHP:      7.4
 * Author:            Luiz Fernando Brogliatto Ferreira
 * Author URI:        https://profiles.wordpress.org/luiz0067/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       luiz0067-big-button
 * Domain Path:       /languages
 *
 * @package           Luiz0067_Big_Button
 */

// Impede o acesso direto ao arquivo.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Constantes do Plugin
define( 'LUIZ0067_BIG_BUTTON_VERSION', '1.0.0' );
define( 'LUIZ0067_BIG_BUTTON_FILE', __FILE__ );
define( 'LUIZ0067_BIG_BUTTON_URL', plugin_dir_url( __FILE__ ) );
define( 'LUIZ0067_BIG_BUTTON_PATH', plugin_dir_path( __FILE__ ) );

/**
 * Registra os scripts e estilos do bloco Gutenberg e registra o bloco no hook 'init'.
 */
function luiz0067_big_button_register_block() {
	$block_js   = LUIZ0067_BIG_BUTTON_PATH . 'assets/js/block.js';
	$style_css  = LUIZ0067_BIG_BUTTON_PATH . 'assets/css/style.css';
	$editor_css = LUIZ0067_BIG_BUTTON_PATH . 'assets/css/editor.css';

	$js_version         = file_exists( $block_js ) ? filemtime( $block_js ) : LUIZ0067_BIG_BUTTON_VERSION;
	$style_version      = file_exists( $style_css ) ? filemtime( $style_css ) : LUIZ0067_BIG_BUTTON_VERSION;
	$editor_css_version = file_exists( $editor_css ) ? filemtime( $editor_css ) : LUIZ0067_BIG_BUTTON_VERSION;

	// Dependências essenciais do Gutenberg para o script Vanilla ES5
	$dependencies = array(
		'wp-blocks',
		'wp-element',
		'wp-block-editor',
		'wp-components',
		'wp-i18n',
	);

	// 1. Registro do script JS do editor
	wp_register_script(
		'luiz0067-big-button-js',
		LUIZ0067_BIG_BUTTON_URL . 'assets/js/block.js',
		$dependencies,
		$js_version,
		true
	);

	// Configura as traduções do script Gutenberg se a função estiver disponível
	if ( function_exists( 'wp_set_script_translations' ) ) {
		wp_set_script_translations(
			'luiz0067-big-button-js',
			'luiz0067-big-button',
			LUIZ0067_BIG_BUTTON_PATH . 'languages'
		);
	}

	// Injeta dicionário multilíngue direto (Inglês, Espanhol, Italiano, Português)
	wp_localize_script(
		'luiz0067-big-button-js',
		'luiz0067BigButtonI18n',
		luiz0067_big_button_get_locale_strings()
	);

	// 2. Registro dos estilos para o frontend e para o canvas do editor
	wp_register_style(
		'luiz0067-big-button-style',
		LUIZ0067_BIG_BUTTON_URL . 'assets/css/style.css',
		array(),
		$style_version
	);

	// 3. Registro do estilo específico do painel do editor
	wp_register_style(
		'luiz0067-big-button-editor-style',
		LUIZ0067_BIG_BUTTON_URL . 'assets/css/editor.css',
		array( 'wp-edit-blocks' ),
		$editor_css_version
	);

	// Configuração comum dos ativos do bloco
	$block_args = array(
		'editor_script' => 'luiz0067-big-button-js',
		'editor_style'  => 'luiz0067-big-button-editor-style',
		'style'         => 'luiz0067-big-button-style',
	);

	// Registro do bloco oficial moderno
	register_block_type( 'luiz0067/big-button', $block_args );

	// Registro de compatibilidade retroativa para cms-adm/big-button caso não esteja registrado
	if ( class_exists( 'WP_Block_Type_Registry' ) && ! WP_Block_Type_Registry::get_instance()->is_registered( 'cms-adm/big-button' ) ) {
		register_block_type( 'cms-adm/big-button', $block_args );
	}
}
add_action( 'init', 'luiz0067_big_button_register_block' );

/**
 * Enfileira os estilos para frontend e Gutenberg canvas.
 */
function luiz0067_big_button_enqueue_block_assets() {
	$style_css = LUIZ0067_BIG_BUTTON_PATH . 'assets/css/style.css';
	$version   = file_exists( $style_css ) ? filemtime( $style_css ) : LUIZ0067_BIG_BUTTON_VERSION;

	wp_enqueue_style(
		'luiz0067-big-button-style',
		LUIZ0067_BIG_BUTTON_URL . 'assets/css/style.css',
		array(),
		$version
	);
}
add_action( 'enqueue_block_assets', 'luiz0067_big_button_enqueue_block_assets' );

/**
 * Enfileira scripts e estilos específicos da área de edição do bloco (Gutenberg admin).
 */
function luiz0067_big_button_enqueue_editor_assets() {
	wp_enqueue_script( 'luiz0067-big-button-js' );
	wp_enqueue_style( 'luiz0067-big-button-editor-style' );
}
add_action( 'enqueue_block_editor_assets', 'luiz0067_big_button_enqueue_editor_assets' );

/**
 * Garante que os blocos estejam na lista de blocos permitidos caso um filtro ativo restrinja os blocos.
 *
 * @param bool|array $allowed_block_types Lista de blocos permitidos.
 * @param object     $editor_context      Contexto do editor.
 * @return bool|array
 */
function luiz0067_big_button_allow_block_type( $allowed_block_types, $editor_context = null ) {
	if ( is_array( $allowed_block_types ) ) {
		if ( ! in_array( 'luiz0067/big-button', $allowed_block_types, true ) ) {
			$allowed_block_types[] = 'luiz0067/big-button';
		}
		if ( ! in_array( 'cms-adm/big-button', $allowed_block_types, true ) ) {
			$allowed_block_types[] = 'cms-adm/big-button';
		}
	}
	return $allowed_block_types;
}
add_filter( 'allowed_block_types_all', 'luiz0067_big_button_allow_block_type', 20, 2 );
add_filter( 'allowed_block_types', 'luiz0067_big_button_allow_block_type', 20, 2 );

/**
 * Suporte a estilos de editor para temas clássicos e Block Themes (Full Site Editing).
 */
function luiz0067_big_button_add_editor_styles() {
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/style.css' );
}
add_action( 'after_setup_theme', 'luiz0067_big_button_add_editor_styles' );

/**
 * Carrega a internacionalização (Text Domain) do plugin.
 */
function luiz0067_big_button_load_textdomain() {
	load_plugin_textdomain(
		'luiz0067-big-button',
		false,
		dirname( plugin_basename( __FILE__ ) ) . '/languages'
	);
}
add_action( 'init', 'luiz0067_big_button_load_textdomain' );

/**
 * Obtém o array de traduções com base no locale atual do WordPress (Italiano, Inglês, Espanhol, Português).
 *
 * @return array
 */
function luiz0067_big_button_get_locale_strings() {
	$locale = function_exists( 'determine_locale' ) ? determine_locale() : ( function_exists( 'get_user_locale' ) ? get_user_locale() : get_locale() );
	$lang = 'pt-br';

	if ( strpos( $locale, 'it' ) === 0 ) {
		$lang = 'it';
	} elseif ( strpos( $locale, 'es' ) === 0 ) {
		$lang = 'es';
	} elseif ( strpos( $locale, 'en' ) === 0 ) {
		$lang = 'en';
	}

	$json_file = LUIZ0067_BIG_BUTTON_PATH . 'languages/' . $lang . '.json';
	if ( file_exists( $json_file ) ) {
		$content = file_get_contents( $json_file );
		if ( $content ) {
			$data = json_decode( $content, true );
			if ( is_array( $data ) ) {
				return $data;
			}
		}
	}
	return array();
}

