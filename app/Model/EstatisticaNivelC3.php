<?php
App::uses('AppModel', 'Model');

/**
 * EstatisticaNivel Model
 *
 */
class EstatisticaNivelC3 extends AppModel { 

	//public $useTable = 'estatisticas'; 
    public $useTable = 'estatistica_niveis_c3';

	public $contains = array(
        'default' => array()
    );      
    
}
