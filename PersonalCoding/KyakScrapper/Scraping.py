from time import sleep
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import csv
def nearest_friday():
    today = datetime.now()
    current_weekday = today.weekday()

    # Calculate the days until the next Friday
    days_until_friday = (4 - current_weekday + 7) % 7

    # Calculate the date of the next Friday
    next_friday = today + timedelta(days=days_until_friday)

    return next_friday.strftime("%Y%m%d")
def makeCSV():
    file_name = "cheapestflights.csv"
    with open(file_name, 'w', newline='') as csv_file:
        csv_writer = csv.writer(csv_file)

    csv_writer.writerows(data)

    print(f'CSV file "{file_name}" has been created successfully.')

def nearest_sunday():
    today = datetime.now()
    current_weekday = today.weekday()

    # Calculate the days until the next Sunday
    days_until_sunday = (6 - current_weekday + 7) % 7

    # Calculate the date of the next Sunday
    next_sunday = today + timedelta(days=days_until_sunday)

    return next_sunday.strftime("%Y%m%d")

def getflightdata(location, listoption):
    chrome_options = Options()
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")
    chrome_options.add_argument("--headless")
    #chrome_options.add_argument("--disable-gpu")
    driver = webdriver.Chrome(options=chrome_options)
    leavedate = nearest_friday()
    homedate = nearest_sunday()
    listoption = listoption

    url = "https://www.kayak.co.uk/explore/{fromlocation}-anywhere/{leavedate},{homedate}?list={listoption}".format(
        fromlocation=location, leavedate=leavedate, homedate=homedate, listoption=listoption
    )
    driver.get(url)
    print("gotDriver")
    actions = ActionChains(driver)
    actions.send_keys(Keys.TAB).send_keys(Keys.TAB).send_keys(Keys.ENTER).perform()
    print("pushedokay")

    destinations = WebDriverWait(driver, 60).until(
        EC.presence_of_all_elements_located((By.XPATH, "//button[@class='Button-No-Standard-Style _id7 _iae _h-Y _iam _TS']"))
    )

    print("got destinations")
    print (destinations)
    driver.quit()

    lstcities = []
    lstcountries = []
    lstprices = []
    for webelement in destinations:
        elementHTML = webelement.get_attribute('outerHTML')
        elementsoup = BeautifulSoup(elementHTML, 'html.parser')
        # city
        city = (elementsoup.find("div", {"class": "_ib0 _igh _ial _1O _iaj City__Name"})).text
        lstcities.append(city)
        # country
        country = (elementsoup.find("div", {"class": "_iC8 _1W _ib0 _iYh _igh Country__Name"})).text
        lstcountries.append(country)
        # price
        price = (elementsoup.find("div", {"class": "_ib0 _18 _igh _ial _iaj"})).text.replace("from £", "")
        lstprices.append(price)

    data = []
    for i in range(len(lstcities)):
        data.append([lstcities[i], lstcountries[i], lstprices[i]])

    return data

