import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/model/patient';
import { PatientName } from 'src/app/model/patient_name';
import { PostalAddress } from 'src/app/model/postal_address';
import { GENDER, MARITAL_STATUS, DISEASE_TYPE, EXCERCISE_TYPE, USAGE_TYPE, YES_NO, ALERGIC_TYPE, DIET_TYPE } from '../../shared/constant';
import { MessageBox, MessageBoxButton } from 'src/app/shared/message-box';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { AppUserAuth } from 'src/app/security/app-user-auth';
import { SecurityService }  from '../../security/security.service';
import { User } from 'src/app/model/user';



@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.css']
})
export class PatientCreateComponent implements OnInit  {
  securityObject: AppUserAuth = null;
  public user: User = new User();
  tomorrow = new Date(); 
  public registerForm: FormGroup;
  public genders = GENDER;
  public marital_status = MARITAL_STATUS;
  public disease_type = DISEASE_TYPE;
  public excercise_type = EXCERCISE_TYPE;
  public tobaco_use_type = USAGE_TYPE;
  public alchohol_use_type = USAGE_TYPE;
  public caffine_use_type = USAGE_TYPE;
  public alergy_yes_no = YES_NO
  public alergy_type = ALERGIC_TYPE;
  public diet_type = DIET_TYPE;
  public suffering = false;
  public states;
  public cities;
  filteredStates: Observable<string[]>;
  filteredCities: Observable<string[]>;
  state = new FormControl();
  city = new FormControl();

  public coll = document.getElementsByClassName("collapsible");
  private i=0;  
  private placeSearch;
  private autocomplete;
  private componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
  };

   
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private service: PatientService,
    private location: Location,
    private securityService: SecurityService
  ) { 
    this.loadCities();
    this.loadStates();
    
  }

 
  ngOnInit() {

    this.try();
    this.city.setValidators( [Validators.required, Validators.maxLength(50)]);
    this.state.setValidators( [Validators.required, Validators.maxLength(50)]);
    this.registerForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(50)]),
      line1: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      line2: new FormControl('', [Validators.maxLength(150)]),
      city: this.city,
      state: this.state,
      zip: new FormControl('', [Validators.required, Validators.maxLength(6), Validators.pattern("[0-9]{6}")]),
      gender: new FormControl('', [Validators.required]),
      dateOfBirth: new FormControl('', [Validators.required]),
      mailId: new FormControl('', [Validators.required, Validators.maxLength(50), Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern("[0-9]{10}")]),
      maritalStatus: new FormControl('', [Validators.required]),
      activity: new FormControl('', [Validators.required]),
      tobacoUse: new FormControl('', [Validators.required]),
      alchoholUse: new FormControl('', [Validators.required]),
      caffineUse: new FormControl('', [Validators.required]),
      allergies: new FormControl('', [Validators.required]),
      diet: new FormControl('', [Validators.required]),
      height: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]),
      weight: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.pattern('^[0-9]+(.[0-9]{0,2})?$')]),
    });

    this.filteredStates = this.state.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.filteredCities = this.city.valueChanges
    .pipe(
      startWith(''),
      map(value => this.filterCities(value))
    );
  }

  private _filter(val: any): string[] {
    let realval = val && typeof val === 'object' ? val.value : val;
    let result = [];
    let lastOption = null;
    for (let i = 0; i < this.states.length; i++) {
      if (!realval || this.states[i].value.toLowerCase().startsWith(realval.toLowerCase())) {
        if (this.states[i].value !== lastOption) {
          lastOption = this.states[i].value;
          result.push(this.states[i]);
        }
      }
    }
    return result;
  }

  private filterCities(val: any): string[] {
    let realval = val && typeof val === 'object' ? val.value : val;
    let result = [];
    let lastOption = null;
    for (let i = 0; i < this.cities.length; i++) {
      if (!realval || this.cities[i].value.toLowerCase().startsWith(realval.toLowerCase())) {
        if (this.cities[i].value !== lastOption) {
          lastOption = this.cities[i].value;
          result.push(this.cities[i]);
        }
      }
    }
    return result;
  }
  

  public try(){
    for (this.i = 0; this.i < this.coll.length; this.i++) {
      this.coll[this.i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }
  }

  

  public hasError(controlName: string, errorName: string) {
    return this.registerForm.controls[controlName].hasError(errorName);
  }

  public register(registerFormValue) {
    if (this.registerForm.valid) {
      var patient = new Patient;
      var patientName = new PatientName;
      patientName.firstName = registerFormValue.firstName;
      patientName.lastName = registerFormValue.lastName;
      patient.patientName = patientName;
      var postalAddress = new PostalAddress;
      postalAddress.line1 = registerFormValue.line1;
      postalAddress.line2 = registerFormValue.line2;
      postalAddress.city = registerFormValue.city;
      postalAddress.state = registerFormValue.state;
      postalAddress.zip = registerFormValue.zip;
      patient.postalAddress = postalAddress;
      patient.gender = registerFormValue.gender;
      patient.dateOfBirth = registerFormValue.dateOfBirth;
      patient.mailId = registerFormValue.mailId;
      patient.phone = registerFormValue.phone;
      patient.maritalStatus = registerFormValue.maritalStatus;
      patient.medHistory = [];
      for (var i = 0; i < this.disease_type.length; i++) {
        if (this.disease_type[i].checked)
          patient.medHistory.push(this.disease_type[i].name);
      }
      patient.activity = registerFormValue.activity;
      patient.tobacoUse = registerFormValue.tobacoUse;
      patient.alchoholUse = registerFormValue.alchoholUse;
      patient.caffineUse = registerFormValue.caffineUse;
      patient.allergies = registerFormValue.allergies;
      patient.allergicFrom = [];
      for (var i = 0; i < this.alergy_type.length; i++) {
        if (this.alergy_type[i].checked)
          patient.allergicFrom.push(this.alergy_type[i].name);
      }
      patient.diet = registerFormValue.diet;
      patient.height = registerFormValue.height;
      patient.weight = registerFormValue.weight;

      this.service.saveData(patient).subscribe(
        response => {
          MessageBox.show(this.dialog, "Alert", 'Successfully added the record', MessageBoxButton.Ok, "350px")
            .subscribe(result => {
              let url: string = `/home`;
              this.router.navigate([url]);
            });
        },
        error => {
        }
      );
    } else
      MessageBox.show(this.dialog, "Error", 'Some Input data are invalid', MessageBoxButton.Ok, "350px");
  }

  onCancel(user:User) {
     
    this.securityService.onCancel(this.user)
    .subscribe(resp => {
      this.securityObject = resp;
    });
    let url: string = `/home`;
    this.router.navigate([url]);
  }

  
  onChange1(event) {
    for (var i = 0; i < this.disease_type.length; i++) {
      if (this.disease_type[i].name == event.source.value) {
        if (event.checked)
          this.disease_type[i].checked = true;
        else
          this.disease_type[i].checked = false;
        break;
      }
    }
  }

  onChange2(event) {
    for (var i = 0; i < this.alergy_type.length; i++) {
      if (this.alergy_type[i].name == event.source.value) {
        if (event.checked)
          this.alergy_type[i].checked = true;
        else
          this.alergy_type[i].checked = false;
        break;
      }
    }
  }

  showAlergyList(event) {
    if (event.value == "Yes")
      this.suffering = true;
    else
      this.suffering = false;
  }

  
  
  // Bias the autocomplete object to the user's geographical location,
  // as supplied by the browser's 'navigator.geolocation' object.
   public geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        var circle = new google.maps.Circle(
            {center: geolocation, radius: position.coords.accuracy});
        this.autocomplete.setBounds(circle.getBounds());
      });
    }
  }


  //build list of states as map of key-value pairs
  loadStates() {
    var allStates = 'Andhra Pradesh, Arunachal Pradesh, Assam, Bihar, Chhattisgarh, Goa, Gujarat, Haryana, Himachal Pradesh, Jammu and Kashmir, Jharkhand, Karnataka, Kerala, Madhya Pradesh, Maharashtra, Manipur, Meghalaya, Mizoram, Nagaland, Odisha, Punjab, Rajasthan, Sikkim, Tamil Nadu, Telangana, Tripura, Uttarakhand, Uttar Pradesh, West Bengal, Andaman and Nicobar Islands, Chandigarh, Dadra and Nagar Haveli, Daman and Diu, Delhi, Lakshadweep, Puducherry';
    this.states =  allStates.split(/, +/g).map( function (state) {
       return {
          value: state.toUpperCase(),
          display: state
       };
    });
 }

 //build list of states as map of key-value pairs
 loadCities() {
  var allCities = 'Achalpur, Achhnera, Adalaj, Adilabad, Adityapur, Adoni, Adoor, Adra, Adyar, Afzalpur, Agartala, Agra, Ahmedabad, Ahmednagar, Aizawl, Ajmer, Akola, Akot, Alappuzha, Aligarh, AlipurdUrban Agglomerationr, Alirajpur, Allahabad, Alwar, Amalapuram, Amalner, Ambejogai, Ambikapur, Amravati, Amreli, Amritsar, Amroha, Anakapalle, Anand, Anantapur, Anantnag, Anjangaon, Anjar, Ankleshwar, Arakkonam, Arambagh, Araria, Arrah, Arsikere, Aruppukkottai, Arvi, Arwal, Asansol, Asarganj, Ashok Nagar, Athni, Attingal, Aurangabad, Aurangabad, Azamgarh, Bagaha, Bageshwar, Bahadurgarh, Baharampur, Bahraich, Balaghat, Balangir, Baleshwar Town, Ballari, Balurghat, Bankura, Bapatla, Baramula, Barbil, Bargarh, Barh, Baripada Town, Barmer, Barnala, Barpeta, Batala, Bathinda, Begusarai, Belagavi, Bellampalle, Belonia, Bengaluru, Bettiah, BhabUrban Agglomeration, Bhadrachalam, Bhadrak, Bhagalpur, Bhainsa, Bharatpur, Bharuch, Bhatapara, Bhavnagar, Bhawanipatna, Bheemunipatnam, Bhilai Nagar, Bhilwara, Bhimavaram, Bhiwandi, Bhiwani, Bhongir, Bhopal, Bhubaneswar, Bhuj, Bikaner, Bilaspur, Bobbili, Bodhan, Bokaro Steel City, Bongaigaon City, Brahmapur, Buxar, Byasanagar, Chaibasa, Chalakudy, Chandausi, Chandigarh, Changanassery, Charkhi Dadri, Chatra, Chennai, Cherthala, Chhapra, Chhapra, Chikkamagaluru, Chilakaluripet, Chirala, Chirkunda, Chirmiri, Chittoor, Chittur-Thathamangalam, Coimbatore, Cuttack, Dalli-Rajhara, Darbhanga, Darjiling, Davanagere, Deesa, Dehradun, Dehri-on-Sone, Delhi, Deoghar, Dhamtari, Dhanbad, Dharmanagar, Dharmavaram, Dhenkanal, Dhoraji, Dhubri, Dhule, Dhuri, Dibrugarh, Dimapur, Diphu, Dumka, Dumraon, Durg, Eluru, English Bazar, Erode, Etawah, Faridabad, Faridkot, Farooqnagar, Fatehabad, Fatehpur Sikri, Fazilka, Firozabad, Firozpur Cantt., Firozpur, Forbesganj, Gadwal, Gandhinagar, Gangarampur, Ganjbasoda, Gaya, Giridih, Goalpara, Gobichettipalayam, Gobindgarh, Godhra, Gohana, Gokak, Gooty, Gopalganj, Gudivada, Gudur, Gumia, Guntakal, Guntur, Gurdaspur, Gurgaon, Guruvayoor, Guwahati, Gwalior, Habra, Hajipur, Haldwani-cum-Kathgodam, Hansi, Hapur, Hardoi , Hardwar, Hazaribag, Hindupur, Hisar, Hoshiarpur, Hubli-Dharwad, Hugli-Chinsurah, Hyderabad, Ichalkaranji, Imphal, Indore, Itarsi, Jabalpur, Jagdalpur, Jaggaiahpet, Jagraon, Jagtial, Jaipur, Jalandhar Cantt., Jalandhar, Jalpaiguri, Jamalpur, Jammalamadugu, Jammu, Jamnagar, Jamshedpur, Jamui, Jangaon, Jatani, Jehanabad, Jhansi, Jhargram, Jharsuguda, Jhumri Tilaiya, Jind, Jodhpur, Jorhat, Kadapa, Kadi, Kadiri, Kagaznagar, Kailasahar, Kaithal, Kakinada, Kalimpong, Kalpi, Kalyan-Dombivali, Kamareddy, Kancheepuram, Kandukur, Kanhangad, Kannur, Kanpur, Kapadvanj, Kapurthala, Karaikal, Karimganj, Karimnagar, Karjat, Karnal, Karur, Karwar, Kasaragod, Kashipur, KathUrban Agglomeration, Katihar, Kavali, Kayamkulam, Kendrapara, Kendujhar, Keshod, Khair, Khambhat, Khammam, Khanna, Kharagpur, Kharar, Khowai, Kishanganj, Kochi, Kodungallur, Kohima, Kolar, Kolkata, Kollam, Koratla, Korba, Kot Kapura, Kota, Kothagudem, Kottayam, Kovvur, Koyilandy, Kozhikode, Kunnamkulam, Kurnool, Kyathampalle, Lachhmangarh, Ladnu, Ladwa, Lahar, Laharpur, Lakheri, Lakhimpur, Lakhisarai, Lakshmeshwar, Lal Gopalganj Nindaura, Lalganj, Lalganj, Lalgudi, Lalitpur, Lalsot, Lanka, Lar, Lathi, Latur, Lilong, Limbdi, Lingsugur, Loha, Lohardaga, Lonar, Lonavla, Longowal, Loni, Losal, Lucknow, Ludhiana, Lumding, Lunawada, Lunglei, Macherla, Machilipatnam, Madanapalle, Maddur, Madhepura, Madhubani, Madhugiri, Madhupur, Madikeri, Madurai, Magadi, Mahad, Mahalingapura, Maharajganj, Maharajpur, Mahasamund, Mahbubnagar, Mahe, Mahemdabad, Mahendragarh, Mahesana, Mahidpur, Mahnar Bazar, Mahuva, Maihar, Mainaguri, Makhdumpur, Makrana, Malaj Khand, Malappuram, Malavalli, Malda, Malegaon, Malerkotla, Malkangiri, Malkapur, Malout, Malpura, Malur, Manachanallur, Manasa, Manavadar, Manawar, Mancherial, Mandalgarh, Mandamarri, Mandapeta, Mandawa, Mandi Dabwali, Mandi, Mandideep, Mandla, Mandsaur, Mandvi, Mandya, Manendragarh, Maner, Mangaldoi, Mangaluru, Mangalvedhe, Manglaur, Mangrol, Mangrol, Mangrulpir, Manihari, Manjlegaon, Mankachar, Manmad, Mansa, Mansa, Manuguru, Manvi, Manwath, Mapusa, Margao, Margherita, Marhaura, Mariani, Marigaon, Markapur, Marmagao, Masaurhi, Mathabhanga, Mathura, Mattannur, Mauganj, Mavelikkara, Mavoor, Mayang Imphal, Medak, Medininagar (Daltonganj), Medinipur, Meerut, Mehkar, Memari, Merta City, Mhaswad, Mhow Cantonment, Mhowgaon, Mihijam, Mira-Bhayandar, Mirganj, Miryalaguda, Modasa, Modinagar, Moga, Mohali, Mokameh, Mokokchung, Monoharpur, Moradabad, Morena, Morinda,  India, Morshi, Morvi, Motihari, Motipur, Mount Abu, Mudabidri, Mudalagi, Muddebihal, Mudhol, Mukerian, Mukhed, Muktsar, Mul, Mulbagal, Multai, Mumbai, Mundargi, Mundi, Mungeli, Munger, Murliganj, Murshidabad, Murtijapur, Murwara (Katni), Musabani, Mussoorie, Muvattupuzha, Muzaffarpur, Mysore, Nabadwip, Nabarangapur, Nabha, Nadbai, Nadiad, Nagaon, Nagapattinam, Nagar, Nagari, Nagarkurnool, Nagaur, Nagda, Nagercoil, Nagina, Nagla, Nagpur, Nahan, Naharlagun, Naidupet, Naihati, Naila Janjgir, Nainital, Nainpur, Najibabad, Nakodar, Nakur, Nalbari, Namagiripettai, Namakkal, Nanded-Waghala, Nandgaon, Nandivaram-Guduvancheri, Nandura, Nandurbar, Nandyal, Nangal, Nanjangud, Nanjikottai, Nanpara, Narasapuram, Narasaraopet, Naraura, Narayanpet, Nargund, Narkatiaganj, Narkhed, Narnaul, Narsinghgarh, Narsinghgarh, Narsipatnam, Narwana, Nashik, Nasirabad, Natham, Nathdwara, Naugachhia, Naugawan Sadat, Nautanwa, Navalgund, Navsari, Nawabganj, Nawada, Nawanshahr, Nawapur, Nedumangad, Neem-Ka-Thana, Neemuch, Nehtaur, Nelamangala, Nellikuppam, Nellore, Nepanagar, New Delhi, Neyveli (TS), Neyyattinkara, Nidadavole, Nilambur, Nilanga, Nimbahera, Nirmal, Niwai, Niwari, Nizamabad, Nohar, Noida, Nokha, Nokha, Nongstoin, Noorpur, North Lakhimpur, Nowgong, Nowrozabad (Khodargama), Nuzvid, OValley, Obra, Oddanchatram, Ongole, Orai, Osmanabad, Ottappalam, Ozar, P.N.Patti, Pachora, Pachore, Pacode, Padmanabhapuram, Padra, Padrauna, Paithan, Pakaur, Palacole, Palai, Palakkad, Palampur, Palani, Palanpur, Palasa Kasibugga, Palghar, Pali, Pali, Palia Kalan, Palitana, Palladam, Pallapatti, Pallikonda, Palwal, Palwancha, Panagar, Panagudi, Panaji, Panamattom, Panchkula, Panchla, Pandharkaoda, Pandharpur, Pandhurna, PandUrban Agglomeration, Panipat, Panna, Panniyannur, Panruti, Panvel, Pappinisseri, Paradip, Paramakudi, Parangipettai, Parasi, Paravoor, Parbhani, Pardi, Parlakhemundi, Parli, Partur, Parvathipuram, Pasan, Paschim Punropara, Pasighat, Patan, Pathanamthitta, Pathankot, Pathardi, Pathri, Patiala, Patna, Patratu, Pattamundai, Patti, Pattran, Pattukkottai, Patur, Pauni, Pauri, Pavagada, Pedana, Peddapuram, Pehowa, Pen, Perambalur, Peravurani, Peringathur, Perinthalmanna, Periyakulam, Periyasemur, Pernampattu, Perumbavoor, Petlad, Phagwara, Phalodi, Phaltan, Phillaur, Phulabani, Phulera, Phulpur, Phusro, Pihani, Pilani, Pilibanga, Pilibhit, Pilkhuwa, Pindwara, Pinjore, Pipar City, Pipariya, Piriyapatna, Piro, Pithampur, Pithapuram, Pithoragarh, Pollachi, Polur, Pondicherry, Ponnani, Ponneri, Ponnur, Porbandar, Porsa, Port Blair, Powayan, Prantij, Pratapgarh, Pratapgarh, Prithvipur, Proddatur, Pudukkottai, Pudupattinam, Pukhrayan, Pulgaon, Puliyankudi, Punalur, Punch, Pune, Punganur, Punjaipugalur, Puranpur, Puri, Purna, Purnia, PurqUrban Agglomerationzi, Purulia, Purwa, Pusad, Puthuppally, Puttur, Puttur, Qadian, Raayachuru, Rabkavi Banhatti, Radhanpur, Rae Bareli, Rafiganj, Raghogarh-Vijaypur, Raghunathganj, Raghunathpur, Rahatgarh, Rahuri, Raiganj, Raigarh, Raikot, Raipur, Rairangpur, Raisen, Raisinghnagar, Rajagangapur, Rajahmundry, Rajakhera, Rajaldesar, Rajam, Rajampet, Rajapalayam, Rajauri, Rajgarh (Alwar), Rajgarh (Churu), Rajgarh, Rajgir, Rajkot, Rajnandgaon, Rajpipla, Rajpura, Rajsamand, Rajula, Rajura, Ramachandrapuram, Ramagundam, Ramanagaram, Ramanathapuram, Ramdurg, Rameshwaram, Ramganj Mandi, Ramgarh, Ramnagar, Ramnagar, Ramngarh, Rampur Maniharan, Rampur, Rampura Phul, Rampurhat, Ramtek, Ranaghat, Ranavav, Ranchi, Ranebennuru, Rangia, Rania, Ranibennur, Ranipet, Rapar, Rasipuram, Rasra, Ratangarh, Rath, Ratia, Ratlam, Ratnagiri, Rau, Raurkela, Raver, Rawatbhata, Rawatsar, Raxaul Bazar, Rayachoti, Rayadurg, Rayagada, Reengus, Rehli, Renigunta, Renukoot, Reoti, Repalle, Revelganj, Rewa, Rewari, Rishikesh, Risod, Robertsganj, Robertson Pet, Rohtak, Ron, Roorkee, Rosera, Rudauli, Rudrapur, Rudrapur, Rupnagar, Sabalgarh, Sadabad, Sadalagi, Sadasivpet, Sadri, Sadulpur, Sadulshahar, Safidon, Safipur, Sagar, Sagara, Sagwara, Saharanpur, Saharsa, Sahaspur, Sahaswan, Sahawar, Sahibganj, Sahjanwa, Saidpur, Saiha, Sailu, Sainthia, Sakaleshapura, Sakti, Salaya, Salem, Salur, Samalkha, Samalkot, Samana, Samastipur, Sambalpur, Sambhal, Sambhar, Samdhan, Samthar, Sanand, Sanawad, Sanchore, Sandi, Sandila, Sanduru, Sangamner, Sangareddy, Sangaria, Sangli, Sangole, Sangrur, Sankarankovil, Sankari, Sankeshwara, Santipur, Sarangpur, Sardarshahar, Sardhana, Sarni, Sarsod, Sasaram, Sasvad, Satana, Satara, Sathyamangalam, Satna, Sattenapalle, Sattur, Saunda, Saundatti-Yellamma, Sausar, Savanur, Savarkundla, Savner, Sawai Madhopur, Sawantwadi, Sedam, Sehore, Sendhwa, Seohara, Seoni, Seoni-Malwa, Shahabad, Shahabad,  Hardoi, Shahabad,  Rampur, Shahade, Shahbad, Shahdol, Shahganj, Shahjahanpur, Shahpur, Shahpura, Shahpura, Shajapur, Shamgarh, Shamli, Shamsabad,  Agra, Shamsabad,  Farrukhabad, Shegaon, Sheikhpura, Shendurjana, Shenkottai, Sheoganj, Sheohar, Sheopur, Sherghati, Sherkot, Shiggaon, Shikaripur, Shikarpur,  Bulandshahr, Shikohabad, Shillong, Shimla, Shirdi, Shirpur-Warwade, Shirur, Shishgarh, Shivamogga, Shivpuri, Sholavandan, Sholingur, Shoranur, Shrigonda, Shrirampur, Shrirangapattana, Shujalpur, Siana, Sibsagar, Siddipet, Sidhi, Sidhpur, Sidlaghatta, Sihor, Sihora, Sikanderpur, Sikandra Rao, Sikandrabad, Sikar, Silao, Silapathar, Silchar, Siliguri, Sillod, Silvassa, Simdega, Sindagi, Sindhagi, Sindhnur, Singrauli, Sinnar, Sira, Sircilla, Sirhind Fatehgarh Sahib, Sirkali, Sirohi, Sironj, Sirsa, Sirsaganj, Sirsi, Sirsi, Siruguppa, Sitamarhi, Sitapur, Sitarganj, Sivaganga, Sivagiri, Sivakasi, Siwan, Sohagpur, Sohna, Sojat, Solan, Solapur, Sonamukhi, Sonepur, Songadh, Sonipat, Sopore, Soro, Soron, Soyagaon, Sri Madhopur, Srikakulam, Srikalahasti, Srinagar, Srinagar, Srinivaspur, Srirampore, Srisailam Project (Right Flank Colony) Township, Srivilliputhur, Sugauli, Sujangarh, Sujanpur, Sullurpeta, Sultanganj, Sultanpur, Sumerpur, Sumerpur, Sunabeda, Sunam, Sundargarh, Sundarnagar, Supaul, Surandai, Surapura, Surat, Suratgarh, SUrban Agglomerationr, Suri, Suriyampalayam, Suryapet, Tadepalligudem, Tadpatri, Takhatgarh, Taki, Talaja, Talcher, Talegaon Dabhade, Talikota, Taliparamba, Talode, Talwara, Tamluk, Tanda, Tandur, Tanuku, Tarakeswar, Tarana, Taranagar, Taraori, Tarbha, Tarikere, Tarn Taran, Tasgaon, Tehri, Tekkalakote, Tenali, Tenkasi, Tenu dam-cum-Kathhara, Terdal, Tezpur, Thakurdwara, Thammampatti, Thana Bhawan, Thane, Thanesar, Thangadh, Thanjavur, Tharad, Tharamangalam, Tharangambadi, Theni Allinagaram, Thirumangalam, Thirupuvanam, Thiruthuraipoondi, Thiruvalla, Thiruvallur, Thiruvananthapuram, Thiruvarur, Thodupuzha, Thoubal, Thrissur, Thuraiyur, Tikamgarh, Tilda Newra, Tilhar, Tindivanam, Tinsukia, Tiptur, Tirora, Tiruchendur, Tiruchengode, Tiruchirappalli, Tirukalukundram, Tirukkoyilur, Tirunelveli, Tirupathur, Tirupathur, Tirupati, Tiruppur, Tirur, Tiruttani, Tiruvannamalai, Tiruvethipuram, Tiruvuru, Tirwaganj, Titlagarh, Tittakudi, Todabhim, Todaraisingh, Tohana, Tonk, Tuensang, Tuljapur, Tulsipur, Tumkur, Tumsar, Tundla, Tuni, Tura, Uchgaon, Udaipur, Udaipur, Udaipurwati, Udgir, Udhagamandalam, Udhampur, Udumalaipettai, Udupi, Ujhani, Ujjain, Umarga, Umaria, Umarkhed, Umbergaon, Umred, Umreth, Una, Unjha, Unnamalaikadai, Unnao, Upleta, Uran Islampur, Uran, Uravakonda, Urmar Tanda, Usilampatti, Uthamapalayam, Uthiramerur, Utraula, Vadakkuvalliyur, Vadalur, Vadgaon Kasba, Vadipatti, Vadnagar, Vadodara, Vaijapur, Vaikom, Valparai, Valsad, Vandavasi, Vaniyambadi, Vapi, Vapi, Varanasi, Varkala, Vasai-Virar, Vatakara, Vedaranyam, Vellakoil, Vellore, Venkatagiri, Veraval, Vidisha, Vijainagar,  Ajmer, Vijapur, Vijayapura, Vijayawada, Vijaypur, Vikarabad, Vikramasingapuram, Viluppuram, Vinukonda, Viramgam, Virudhachalam, Virudhunagar, Visakhapatnam, Visnagar, Viswanatham, Vita, Vizianagaram, Vrindavan, Vyara, Wadgaon Road, Wadhwan, Wadi, Wai, Wanaparthy, Wani, Wankaner, Wara Seoni, Warangal, Wardha, Warhapur, Warisaliganj, Warora, Warud, Washim, Wokha, Yadgir, Yamunanagar, Yanam, Yavatmal, Yawal, Yellandu, Yemmiganur, Yerraguntla, Yevla, Zaidpur, Zamania, Zira, Zirakpur, Zunheboto'
  this.cities =  allCities.split(/, +/g).map( function (city) {
     return {
        value: city.toUpperCase(),
        display: city
     };
  });
}

}
