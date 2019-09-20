<?php
App::uses('AppModel', 'Model');
App::uses('DecisionTreeParameter', 'Lib/Mapbiomas/Service/Classificacao');

/**
 * ClassificacaoTarefa Model
 *
 */
class ClassificacaoTarefa extends AppModel
{

    /**
     * belongsTo associations
     *
     * @var array
     */
    public $belongsTo = array(
        'Classificacao' => array(
            'className'  => 'Classificacao',
            'foreignKey' => 'classificacao_id',
            'conditions' => '',
            'fields'     => '',
            'order'      => '',
        ),
    );

    public $contains = array(
        'default' => array(
            'Classificacao' => array(
                'Bioma'       => array(
                    'fields' => array('nome','colecao'),
                ),
                'DecisionTree',
                'Carta'       => array(
                    'fields' => array('codigo'),
                ),
                'CartaRegiao' => array(
                    'fields' => array('regiao'),
                ),
                'CartaRegiaoInfo'=> array(
                    'fields' => array('id', 'region', 'codigo'),
                ),
                'Colecao'
            ),
        ),
        'tarefaProcess' => array(
            'Classificacao' => array(
                /* 'fields' => array(
                    "id",
                    "carta_id",
                    "bioma_id",
                    "year",
                    "t0",
                    "t1",
                    "cloudcover",
                    "dtv",
                    "sensor",
                    "dt",
                    "region",
                    "created",
                    "modified",
                    "identificador",
                    "versao",
                    "versao_final"                                        
                ), */
                'Bioma'       => array(
                    'fields' => array('nome','colecao'),
                ),
                'DecisionTree',
                'Carta'       => array(
                    'fields' => array('codigo'),
                ),
                'CartaRegiao' => array(
                    'fields' => array('regiao'),
                ),
                'Colecao'
            ),
        ),
    );

    public function afterFind($results, $primary = false)
    {

        $DecisionTreeParameter = new DecisionTreeParameter();

        foreach ($results as $key => &$val) {
            if (isset($val['ClassificacaoTarefa']['geetask'])) {
                $val['ClassificacaoTarefa']['geetask'] = json_decode($val['ClassificacaoTarefa']['geetask'], true);
            }

            if (isset($val['Classificacao']['DecisionTree'])) {
                $Classificacao = array(
                    "Classificacao" => $val['Classificacao'],
                );

                $DecisionTree = array(
                    'DecisionTree' => $val['Classificacao']['DecisionTree'],
                );

                $dtree = json_decode($DecisionTreeParameter->buildDtreeParam($Classificacao, $DecisionTree), true);

                $val['Classificacao']['DecisionTree']['dtree'] = $dtree;
            }

            if (isset($val['Classificacao']['Colecao']['config'])) {
                $val['Classificacao']['Colecao']['config'] = json_decode($val['Classificacao']['Colecao']['config'], true);
            }
            
            if (empty($val['Classificacao']['CartaRegiao']) && !isset($val['Classificacao']['CartaRegiaoInfo']['codigo'])) {
                $val['Classificacao']['CartaRegiao'] = ['regiao' => '0'];
            } else {
                $val['Classificacao']['CartaRegiao'] = ['regiao' => $val['Classificacao']['CartaRegiaoInfo']['codigo']];
            }
        }
        return $results;
    }

    public function beforeSave($options = array())
    {
        if (isset($this->data['ClassificacaoTarefa']['geetask'])) {
            $this->data['ClassificacaoTarefa']['geetask'] = json_encode($this->data['ClassificacaoTarefa']['geetask']);
        }
        return true;
    }
}
