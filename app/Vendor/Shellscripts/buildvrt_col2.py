import os
import os.path

biomas = ["AMAZONIA", "MATAATLANTICA", "PANTANAL", "CERRADO", "CAATINGA", "PAMPA"]


'''
 RGB
'''

# mosaico de integracao do brasil por ano
nextAno = 2000
while nextAno <= 2016:    
    
    strReplace = {'ano': nextAno}

    if os.path.isdir("../RGB/BRASIL/%(ano)s" % strReplace):
        print("../RGB/BRASIL/%(ano)s" % strReplace)
        cmdFind = "find ../RGB/BRASIL/%(ano)s/ -name *.tif > RGB_PAIS_BRASIL_%(ano)s.txt" % strReplace
        cmdGdalbuildvrt = "gdalbuildvrt -allow_projection_difference -overwrite -input_file_list RGB_PAIS_BRASIL_%(ano)s.txt RGB_PAIS_BRASIL_%(ano)s.vrt" % strReplace
        print "RGB BRASIL : " + str(nextAno)
        os.system(cmdFind)
        os.system(cmdGdalbuildvrt)        
    
    nextAno += 1


'''
 INTEGRACAO
'''

# mosaico de integracao do brasil por ano
nextAno = 2000
while nextAno <= 2016:    
    
    strReplace = {'ano': nextAno}

    if os.path.isdir("../INTEGRACAO/BRASIL/%(ano)s" % strReplace):
        print("../INTEGRACAO/BRASIL/%(ano)s" % strReplace)
        cmdFind = "find ../INTEGRACAO/BRASIL/%(ano)s/ -name *.tif > INTEGRACAO_PAIS_BRASIL_%(ano)s.txt" % strReplace
        cmdGdalbuildvrt = "gdalbuildvrt -allow_projection_difference -overwrite -input_file_list INTEGRACAO_PAIS_BRASIL_%(ano)s.txt INTEGRACAO_PAIS_BRASIL_%(ano)s.vrt" % strReplace
        print "INTEGRACAO BRASIL : " + str(nextAno)
        os.system(cmdFind)
        os.system(cmdGdalbuildvrt)        
    
    nextAno += 1

'''
 TRANSICAO
'''

# mosaico de transicao

years_pair = ['2000_2001', '2001_2002', '2002_2003', '2003_2004', '2004_2005', '2005_2006','2006_2007', '2007_2008', '2008_2009', '2009_2010', '2010_2011', '2011_2012','2012_2013', '2013_2014', '2014_2015', '2015_2016', '2000_2005', '2005_2010','2010_2015', '2000_2016', '2008_2016']


for years in years_pair:

    strReplace = {'ano': years}

    if os.path.isdir("../TRANSICAO/BRASIL/%(ano)s" % strReplace):
        print("..TRANSICAO/BRASIL/%(ano)s" % strReplace)
        cmdFind = "find ../TRANSICAO/BRASIL/%(ano)s/ -name *.tif > TRANSICAO_PAIS_BRASIL_%(ano)s.txt" % strReplace
        cmdGdalbuildvrt = "gdalbuildvrt -allow_projection_difference -overwrite -input_file_list TRANSICAO_PAIS_BRASIL_%(ano)s.txt TRANSICAO_PAIS_BRASIL_%(ano)s.vrt" % strReplace
        print "TRANSICAO BRASIL : " + str(years)
        os.system(cmdFind)
        os.system(cmdGdalbuildvrt)

