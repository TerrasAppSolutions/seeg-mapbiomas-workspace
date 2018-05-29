#!/usr/bin/env python
# -*- coding: utf-8 -*-
import ee
import json
import sys
import time


class ExportGeeAssetsStatus(object):

    options = {
        'assets': {
            'mosaico': 'projects/mapbiomas-workspace/MOSAICOS/workspace',
            'classificacao': 'projects/mapbiomas-workspace/COLECAO2_1/classificacao',
            'classificacao-ft': 'projects/mapbiomas-workspace/COLECAO2_1/classificacao-ft'
        }
    }

    def __init__(self, options=None):

        if options != None:
            self.options.update(options)

        ee.Initialize()

    def listGroupAssets(self, bioma=None):
        """
        Dicionario de task_ids das imagens processados e temporarias agrupadas por coleçao       
        """

        results = {}

        results['mosaico']  = self.listByProcessedStatus(self.options['assets']['mosaico'], bioma)

        time.sleep(1)

        results['classificacao'] = self.listByProcessedStatus(self.options['assets']['classificacao'], bioma)
        
        time.sleep(1)

        results['classificacao-ft'] = self.listByProcessedStatus(self.options['assets']['classificacao-ft'], bioma)

        time.sleep(1)

        return results

    def listByProcessedStatus(self, collection_id, bioma=None):
        """
        Lista task_id das imagens processados e temporarias da coleçao requisitada

        Keyword arguments:        
        collection_id -- endereço do assets da coleção
        """

        img_collection = ee.ImageCollection(collection_id).filterMetadata('task_id', 'not_equals', None)

        if bioma != None:            
            img_collection = img_collection.filterMetadata('biome', 'equals', bioma)

        # lista de imagens da coleção
        img_list = img_collection.toList(20000)

        # mapea a lista de imagens para lista de id e taskis
        img_taskid_list = img_list.map(lambda img: self.__map_img_taskid(img))

        # baixa lista do earthengine
        dataall = img_taskid_list.getInfo()

        # filtra imagens processadas e temp
        data = filter(lambda imgdata: imgdata[
                      'id'].find('_temp') == -1, dataall)

        data_temp = filter(lambda imgdata: imgdata[
                           'id'].find('_temp') >= 0, dataall)

        # mapea listas com somente task_id
        data_task_ids = map(lambda imgdata: int(imgdata['task_id']), data)

        data_temp_task_ids = map(
            lambda imgdata: int(imgdata['task_id']), data_temp)

        # retorna dicionario com task_id processados e temporarios separados
        return {'processed': data_task_ids, 'temp': data_temp_task_ids}

    def __map_img_taskid(self, img):
        """
        Retorna id e task_id da img informada 

        Keyword arguments:        
        img -- ee.BaseAlgorith da imagem
        """
        eeimg = ee.Image(img)
        return {'id': eeimg.id(), 'task_id': eeimg.get('task_id')}


if __name__ == '__main__':

    params = sys.argv

    bioma = None

    try:
        bioma = params[1]
    except expression:
        bioma = None

    exportstatus = ExportGeeAssetsStatus()

    print(json.dumps(exportstatus.listGroupAssets(bioma)))
