import os
import os.path

biomas = ["AMAZONIA", "MATAATLANTICA", "PANTANAL", "CERRADO", "CAATINGA", "PAMPA", "ZONACOSTEIRA"]


'''
 CLASSIFICACAO
'''

# mosaico de classificacao por bioma e ano
for bioma in biomas:
    nextAno = 2008
    print os.path.exists('../CLASSIFICACAOFT/BIOMA/' + bioma)
    while nextAno <= 2015:
        if os.path.exists('../CLASSIFICACAOFT/BIOMA/' + bioma):           
            strReplace = {'bioma': bioma, 'ano': nextAno}
            cmdFind = "find ../CLASSIFICACAOFT/BIOMA/%(bioma)s/ -name '*%(ano)s*' > BIOMA_%(bioma)s_%(ano)s.txt" % strReplace
            cmdGdalbuildvrt = "gdalbuildvrt -allow_projection_difference -overwrite -input_file_list BIOMA_%(bioma)s_%(ano)s.txt BIOMA_%(bioma)s_%(ano)s.vrt" % strReplace
            print bioma + " : " + str(nextAno)
            os.system(cmdFind)
            os.system(cmdGdalbuildvrt)
        nextAno += 1
# mosaico de classicacao do brasil por ano
nextAno = 2008    
while nextAno <= 2015:                
    strReplace = {'ano': nextAno}
    cmdFind = "find ../CLASSIFICACAOFT/BIOMA/ -name '*%(ano)s*' > PAIS_BRASIL_%(ano)s.txt" % strReplace
    cmdGdalbuildvrt = "gdalbuildvrt -allow_projection_difference -overwrite -input_file_list PAIS_BRASIL_%(ano)s.txt PAIS_BRASIL_%(ano)s.vrt" % strReplace
    print "BRASIL : " + str(nextAno)
    os.system(cmdFind)
    os.system(cmdGdalbuildvrt)
    nextAno += 1
'''
 INTEGRACAO
'''
# mosaico de integracao por bioma e ano
for bioma in biomas:
    nextAno = 2008
    print os.path.exists('../INTEGRACAOC/BIOMA/' + bioma)
    while nextAno <= 2015:
        if os.path.exists('../INTEGRACAOC/BIOMA/' + bioma):           
            strReplace = {'bioma': bioma, 'ano': nextAno}
            cmdFind = "find ../INTEGRACAOC/BIOMA/%(bioma)s/ -name '*%(ano)s*' > INTEGRACAO_BIOMA_%(bioma)s_%(ano)s.txt" % strReplace
            cmdGdalbuildvrt = "gdalbuildvrt -allow_projection_difference -overwrite -input_file_list INTEGRACAO_BIOMA_%(bioma)s_%(ano)s.txt INTEGRACAO_BIOMA_%(bioma)s_%(ano)s.vrt" % strReplace
            print 'INTEGRACAO ' + bioma + " : " + str(nextAno)
            os.system(cmdFind)
            os.system(cmdGdalbuildvrt)
        nextAno += 1

# mosaico de integracao do brasil por ano
nextAno = 2008    
while nextAno <= 2015:                
    strReplace = {'ano': nextAno}
    cmdFind = "find ../INTEGRACAOC/BIOMA/ -name '*%(ano)s*' > INTEGRACAO_PAIS_BRASIL_%(ano)s.txt" % strReplace
    cmdGdalbuildvrt = "gdalbuildvrt -allow_projection_difference -overwrite -input_file_list INTEGRACAO_PAIS_BRASIL_%(ano)s.txt INTEGRACAO_PAIS_BRASIL_%(ano)s.vrt" % strReplace
    print "INTEGRACAO BRASIL : " + str(nextAno)
    os.system(cmdFind)
    os.system(cmdGdalbuildvrt)
    nextAno += 1 
  

'''# mosaico de integracao do brasil por ano
nextAno = 2008    
while nextAno <= 2016:    
    
    strReplace = {'ano': nextAno}

    if os.path.isdir("../INTEGRACAO/BRASIL/%(ano)s" % strReplace):
        print("../INTEGRACAO/BRASIL/%(ano)s" % strReplace)
        cmdFind = "find ../INTEGRACAO/BRASIL/%(ano)s/ -name *.tif > INTEGRACAO_PAIS_BRASIL_%(ano)s.txt" % strReplace
        cmdGdalbuildvrt = "gdalbuildvrt -allow_projection_difference -overwrite -input_file_list INTEGRACAO_PAIS_BRASIL_%(ano)s.txt INTEGRACAO_PAIS_BRASIL_%(ano)s.vrt" % strReplace
        print "INTEGRACAO BRASIL : " + str(nextAno)
        os.system(cmdFind)
        os.system(cmdGdalbuildvrt)        
    
    nextAno += 1'''



'''
 TRANSICAO
'''
transicaoAnos = ['2008-2009','2009-2010','2010-2011','2011-2012','2012-2013','2013-2014','2014-2015']
# mosaico de transicao por bioma e ano
for bioma in biomas:    
    print os.path.exists('../TRANSICAO/BIOMA/' + bioma)
    for tano in transicaoAnos:
        if os.path.exists('../TRANSICAO/BIOMA/' + bioma):           
            strReplace = {'bioma': bioma, 'ano': tano,'ano_': tano.replace('-','_')}
            cmdFind = "find ../TRANSICAO/BIOMA/%(bioma)s/ -name '*%(ano_)s*' > TRANSICAO_BIOMA_%(bioma)s_%(ano)s.txt" % strReplace
            cmdGdalbuildvrt = "gdalbuildvrt -allow_projection_difference -overwrite -input_file_list TRANSICAO_BIOMA_%(bioma)s_%(ano)s.txt TRANSICAO_BIOMA_%(bioma)s_%(ano)s.vrt" % strReplace
            print 'TRANSICAO ' + bioma + " : " + str(tano)
            os.system(cmdFind)
            os.system(cmdGdalbuildvrt)


# mosaico de transicao do brasil por ano

for tano in transicaoAnos:
    strReplace = {'ano': tano,'ano_': tano.replace('-','_')}
    cmdFind = "find ../TRANSICAO/BIOMA/ -name '*%(ano_)s*' > TRANSICAO_PAIS_BRASIL_%(ano)s.txt" % strReplace
    cmdGdalbuildvrt = "gdalbuildvrt -allow_projection_difference -overwrite -input_file_list TRANSICAO_PAIS_BRASIL_%(ano)s.txt TRANSICAO_PAIS_BRASIL_%(ano)s.vrt" % strReplace
    print "TRANSICAO BRASIL : " + str(tano)
    os.system(cmdFind)
    os.system(cmdGdalbuildvrt)
