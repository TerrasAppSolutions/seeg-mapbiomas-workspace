<?php

/**
 * Classe que aplica valores dos parametros na arvore de decisão
 */
class DecisionTreeParameter
{
    /**
     * Retorna arvore de decisão com os parametros de classificação
     * @param Array $classification Registro de parametros de classficação
     * @param Array $decisionTree   Registro de Arvore de decisão
     * @return Array arvore de decisão com os parametros de classificação
     */
    public function buildDtreeParam($classification, $decisionTree)
    {
        // decision tree
        $dtree                          = $decisionTree;
        $dtree['DecisionTree']['dtree'] = json_decode($dtree['DecisionTree']['dtree'], true);

        // parametros classificação
        $dtv = $classification['Classificacao']['dtv'];

        if ($dtree['DecisionTree']['id'] == 1 && isset($dtv['dtv1'])) {
            $dtree['DecisionTree']['dtree']['3-1']['rule']['thresh'] = intval($dtv['dtv1']);
            $dtree['DecisionTree']['dtree']['4-2']['rule']['thresh'] = intval($dtv['dtv2']);
            $dtree['DecisionTree']['dtree']['5-3']['rule']['thresh'] = intval($dtv['dtv3']);
            $dtree['DecisionTree']['dtree']['2-1']['rule']['thresh'] = intval($dtv['dtv4']);
        } else {
            foreach ($dtree['DecisionTree']['dtree'] as $key => &$node) {
                if ($node['kind'] == 'decision' && isset($dtv[$key])) {
                    $node['rule']['thresh'] = intval($dtv[$key]);
                }
            }
        }        

        return json_encode($dtree['DecisionTree']['dtree']);

    }

    /**
     * Retorna parametros de classificação da árvore de decisão
     * @return Array parametros da árvore de decisão
     */
    public function extractClassificationParam($dtree)
    {
        /*
    $dtv = [];

    if ($dtree['DecisionTree']['id'] == 1) {
    $dtv['dtv1'] = dtree['3-1'] . rule . thresh;
    $dtv['dtv2'] = dtree['4-2'] . rule . thresh;
    $dtv['dtv3'] = dtree['5-3'] . rule . thresh;
    $dtv['dtv4'] = dtree['2-1'] . rule . thresh;
    } else {
    angular . foreach (dtree, function (node, key) {
    if (node . kind == 'decision') {
    dtv[key] = node . rule . thresh;
    }
    });
    }

    return dtv;
     */
    }    

}
