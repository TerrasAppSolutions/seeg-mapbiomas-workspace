<?php
App::uses('AppModel', 'Model');

/**
 * EstatisticaNivel Model
 *
 */
class EstatisticaNivel extends AppModel { 

	//public $useTable = 'estatisticas'; 
    public $useTable = 'estatistica_niveis';

	public $contains = array(
        'default' => array()
    );      
    
}
