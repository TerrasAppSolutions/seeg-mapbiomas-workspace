<?php

App::uses('HttpSocket', 'Network/Http');

/**
 * Classe cliente da api de processamento de tarefas
 */
class ProcessTarefaHttp
{
    /**
     * Base url da api de processamento de tarefas
     *
     * @var String
     */
    public $baseUrl;

    /**
     * CakePhp HTTP network communication
     *
     * @var Cake.CakeSocket.HttpSocket
     */
    private $HttpSocket;


    public function __construct()
    {
        //$this->baseUrl= Configure::read('CONFIG')['IMGSERVER']['host'] . '/api/mapbiomas';
        $this->baseUrl= 'http://172.21.0.1:8000/api/mapbiomas/mosaic';
        $this->HttpSocket = new HttpSocket();
    }
   
    /**
     * API de processanto de tarefas de mosaico
     *
     * @return HttpSocket Response
     */
    public function mosaic($task_param)
    {       
        try {            
            $result = $this->HttpSocket->post($this->baseUrl.'/mosaic', json_encode($task_param));
        } catch (Exception $exc) {
            echo $exc;
            $result = null;
        }
        return $result;
    }

    /**
     * API de processanto de tarefas de classificacao
     *
     * @return HttpSocket Response
     */
    public function classification($task_param)
    {        
        try {
            $result = $this->HttpSocket->post($this->baseUrl.'/classification', json_encode($task_param));
        } catch (Exception $exc) {
            $result = null;
        }
        return $result;
    }

    /**
     * API de processanto de tarefas de filtro temporal
     *
     * @return HttpSocket Response
     */
    public function temporalfilter($task_param)
    {
        try {
            $result = $this->HttpSocket->post($this->baseUrl.'/temporalfilter', json_encode($task_param));
        } catch (Exception $exc) {
            $result = null;
        }
        return $result;
    }

    /**
     * API de processanto de tarefas de integração
     *
     * @return HttpSocket Response
     */
    public function integration($task_param)
    {
        try {
            $result = $this->HttpSocket->post($this->baseUrl.'/integration', json_encode($task_param));
        } catch (Exception $exc) {
            $result = null;
        }
        return $result;
    }
}
