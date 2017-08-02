<?php 
class AppSchema extends CakeSchema {

	public function before($event = array()) {
		return true;
	}

	public function after($event = array()) {
	}

	public $biomas = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'nome' => array('type' => 'string', 'null' => false, 'length' => 100),
		'the_geom' => array('type' => 'text', 'null' => true),
		'created' => array('type' => 'date', 'null' => true),
		'colecao' => array('type' => 'string', 'null' => true, 'length' => 50),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $carta_regioes = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'bioma_id' => array('type' => 'integer', 'null' => false),
		'carta_id' => array('type' => 'integer', 'null' => false),
		'regiao' => array('type' => 'string', 'null' => false, 'length' => 20),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $cartas = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'codigo' => array('type' => 'string', 'null' => false, 'length' => 20),
		'the_geom' => array('type' => 'text', 'null' => true),
		'created' => array('type' => 'date', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $classe_areas = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'classe_id' => array('type' => 'integer', 'null' => false),
		'the_geom' => array('type' => 'text', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'usuario_id' => array('type' => 'integer', 'null' => true),
		'year' => array('type' => 'string', 'null' => true, 'length' => 4),
		'bioma_id' => array('type' => 'integer', 'null' => true),
		'type_id' => array('type' => 'integer', 'null' => true),
		'carta' => array('type' => 'string', 'null' => true, 'length' => 10),
		'status' => array('type' => 'integer', 'null' => true, 'default' => '0'),
		'pixel_values' => array('type' => 'text', 'null' => true),
		'classificacao_id' => array('type' => 'integer', 'null' => true),
		'log' => array('type' => 'string', 'null' => true, 'length' => 500),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $classes = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'classe' => array('type' => 'string', 'null' => false, 'length' => 50),
		'cor' => array('type' => 'string', 'null' => true, 'length' => 10),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $classificacao_imagens = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'bioma_id' => array('type' => 'integer', 'null' => false),
		'carta_id' => array('type' => 'integer', 'null' => false),
		'ano' => array('type' => 'string', 'null' => false, 'length' => 5),
		'imagem' => array('type' => 'string', 'null' => false, 'length' => 100),
		'exist' => array('type' => 'boolean', 'null' => true, 'default' => false),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $classificacao_tarefas = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'classificacao_id' => array('type' => 'integer', 'null' => false),
		'fase' => array('type' => 'integer', 'null' => true),
		'status' => array('type' => 'integer', 'null' => true),
		'tarefa_id' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'gee_start' => array('type' => 'datetime', 'null' => true),
		'gee_end' => array('type' => 'datetime', 'null' => true),
		'completed' => array('type' => 'datetime', 'null' => true),
		'log' => array('type' => 'string', 'null' => true, 'length' => 500),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $classificacao_usuarios = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'usuario_id' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'date', 'null' => true),
		'classificacao_id' => array('type' => 'integer', 'null' => true),
		'versao' => array('type' => 'text', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $classificacoes = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'carta_id' => array('type' => 'integer', 'null' => false),
		'bioma_id' => array('type' => 'integer', 'null' => false),
		'year' => array('type' => 'string', 'null' => true, 'length' => 5),
		't0' => array('type' => 'date', 'null' => true),
		't1' => array('type' => 'date', 'null' => true),
		'cloudcover' => array('type' => 'integer', 'null' => true),
		'dtv' => array('type' => 'text', 'null' => true),
		'sensor' => array('type' => 'string', 'null' => true, 'length' => 20),
		'tag_on' => array('type' => 'integer', 'null' => true),
		'ndfi' => array('type' => 'integer', 'null' => true),
		'sma' => array('type' => 'integer', 'null' => true),
		'ref' => array('type' => 'integer', 'null' => true),
		'dt' => array('type' => 'integer', 'null' => true),
		'save' => array('type' => 'integer', 'null' => true),
		'color' => array('type' => 'string', 'null' => true, 'length' => 10),
		'elevation_on' => array('type' => 'integer', 'null' => true, 'default' => '0'),
		'elevation_min' => array('type' => 'integer', 'null' => true, 'default' => '0'),
		'elevation_max' => array('type' => 'integer', 'null' => true, 'default' => '0'),
		'region' => array('type' => 'string', 'null' => true, 'length' => 10),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'identificador' => array('type' => 'string', 'null' => true, 'length' => 100),
		'versao' => array('type' => 'string', 'null' => true, 'length' => 20),
		'versao_final' => array('type' => 'boolean', 'null' => true, 'default' => false),
		'regiao_id' => array('type' => 'integer', 'null' => true),
		'decision_tree_id' => array('type' => 'integer', 'null' => true, 'default' => '1'),
		'colecao_id' => array('type' => 'integer', 'null' => false),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $colecoes = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'colecao' => array('type' => 'string', 'null' => false, 'length' => 50),
		'status' => array('type' => 'integer', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $decision_trees = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'dtree' => array('type' => 'text', 'null' => false),
		'usuario_id' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'bioma_id' => array('type' => 'integer', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $estados = array(
		'id' => array('type' => 'integer', 'null' => false, 'length' => 11, 'key' => 'primary'),
		'nome_estado' => array('type' => 'string', 'null' => true),
		'nome_regiao' => array('type' => 'string', 'null' => true),
		'the_geom' => array('type' => 'text', 'null' => true),
		'rl_ap' => array('type' => 'boolean', 'null' => true),
		'observacao' => array('type' => 'string', 'null' => true),
		'ap_porcentagem' => array('type' => 'float', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $estatistica_transicoes = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'classe_inicial' => array('type' => 'integer', 'null' => true),
		'classe_final' => array('type' => 'integer', 'null' => true),
		'area' => array('type' => 'float', 'null' => true),
		'ano_inicial' => array('type' => 'string', 'null' => true, 'length' => 4),
		'ano_final' => array('type' => 'string', 'null' => true, 'length' => 4),
		'territorio' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'porcentagem' => array('type' => 'integer', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $estatisticas = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'territorio' => array('type' => 'integer', 'null' => true),
		'classe' => array('type' => 'integer', 'null' => true),
		'ano' => array('type' => 'string', 'null' => true, 'length' => 4),
		'area' => array('type' => 'float', 'null' => true),
		'created' => array('type' => 'datetime', 'null' => true),
		'modified' => array('type' => 'datetime', 'null' => true),
		'percentagem' => array('type' => 'float', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $municipios = array(
		'id' => array('type' => 'integer', 'null' => false, 'length' => 11, 'key' => 'primary'),
		'id_estado' => array('type' => 'integer', 'null' => true),
		'id_mesorregiao' => array('type' => 'integer', 'null' => true),
		'id_microrregiao' => array('type' => 'integer', 'null' => true),
		'nome_municipio' => array('type' => 'string', 'null' => true),
		'ano_instalacao' => array('type' => 'string', 'null' => true, 'length' => 4),
		'area' => array('type' => 'float', 'null' => true),
		'modulo_fiscal' => array('type' => 'float', 'null' => true),
		'the_geom' => array('type' => 'text', 'null' => true),
		'rl_ap' => array('type' => 'boolean', 'null' => true),
		'am_legal' => array('type' => 'boolean', 'null' => true),
		'observacao_am' => array('type' => 'string', 'null' => true),
		'observacao_ap' => array('type' => 'string', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $perfis = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'nome' => array('type' => 'string', 'null' => false, 'length' => 100),
		'created' => array('type' => 'date', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $qualidades = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'bioma_id' => array('type' => 'integer', 'null' => false),
		'carta_id' => array('type' => 'integer', 'null' => false),
		'ano' => array('type' => 'integer', 'null' => false),
		'qualidade' => array('type' => 'integer', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $territorios = array(
		'id' => array('type' => 'integer', 'null' => false, 'length' => 11, 'key' => 'primary'),
		'descricao' => array('type' => 'string', 'null' => true, 'length' => 50),
		'categoria' => array('type' => 'string', 'null' => true, 'length' => 50),
		'the_geom' => array('type' => 'text', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $usuario_biomas = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'usuario_id' => array('type' => 'integer', 'null' => false),
		'bioma_id' => array('type' => 'integer', 'null' => true),
		'date' => array('type' => 'date', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $usuario_perfis = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'usuario_id' => array('type' => 'integer', 'null' => true),
		'perfil_id' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'date', 'null' => true),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

	public $usuarios = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'length' => 11, 'key' => 'primary'),
		'nome' => array('type' => 'string', 'null' => false, 'length' => 200),
		'email' => array('type' => 'string', 'null' => false, 'length' => 50),
		'password' => array('type' => 'string', 'null' => false, 'length' => 100),
		'perfil_id' => array('type' => 'integer', 'null' => true),
		'created' => array('type' => 'date', 'null' => true),
		'aprovado' => array('type' => 'integer', 'null' => true, 'default' => '0'),
		'indexes' => array(
			'PRIMARY' => array('unique' => true, 'column' => 'id')
		),
		'tableParameters' => array()
	);

}
