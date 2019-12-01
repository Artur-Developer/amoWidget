function clearValuesMultySelect() {
    var multyselect_first_element = multiseelct_element.parents().siblings(".linked-form__field__value").find(".checkboxes_dropdown__item:first-child");
    if (multyselect_first_element.children('label').hasClass('is-checked')) {
        multyselect_first_element.find(".js-form-changes-skip").click();
    }
}

var multyselect_label_text = "Создать еще сделку",
    multiseelct_element = $('.linked-form__field__label span:contains(' + multyselect_label_text + ')'),
    html_checkbox = '<div class="linked-form__field linked-form__field-checkbox "><div class="linked-form__field__label"><span>Добавить ещё сделки</span></div><div class="linked-form__field__value ">' +
    '<label class="control-checkbox add_more_leads "><div class="control-checkbox__body"><input type="checkbox" class=""><span class="control-checkbox__helper "></span></div></label></div></div>',
    id_field_roistate = 6961;

$(document).ready(function() {
    multiseelct_element_insert_before = multiseelct_element.parents('.linked-form__field-multiselect').hide();
    multiseelct_element_insert_before.add(html_checkbox).insertBefore(multiseelct_element_insert_before);
    clearValuesMultySelect();
});

$(document).on('click', '.add_more_leads', function() {
    if ($(this).hasClass("is-checked")) {
        multiseelct_element.parents('.linked-form__field-multiselect').hide();
    } else {
        multiseelct_element.parents('.linked-form__field-multiselect').show();
    }
});

$(document).on('click', '.button-input_add', function() {
    // $("#").
    // var def_id_common_list = '229537';
    // var id_field_roistate = 6961;
    // var check_common_list = $('.linked-form_field.linked-formfield-select .linked-formfield_value input').is('[name="CFV['+def_id_common_list+']"]');
    // var value_roistate = $('input[name="CFV['+id_field_roistate+']"]').val();
    // if(check_common_list){
    //   var array_li_text = [];
    //   $('.linked-form_field.linked-formfield-select .linked-formfield_value input[name="CFV['+def_id_common_list+']"]').siblings("ul").children("li span").text(function( index,value) {
    //     //if(index !== 0){
    //   //console.log(index);
    //         array_li_text.push(value);
    //     //}      
    // //console.log( index + ": " + $( this ).find('li span').text() );
    //   });
    //     var array_li_id = [];
    //   $('.linked-form_field.linked-formfield-select .linked-formfield_value input[name="CFV['+def_id_common_list+']"]').siblings("ul").children("li").attr("data-value", function( index,value ) {
    //         if(index !== 0){
    //             array_li_id.push(value);
    //         }
    //     })
    // } else {
    //   // добавить сообщение в интерфейс
    // }
    // // console.log(array_li_text);
    // // console.log(array_li_id);


    function createLead() {
        $.get('https://' + AMOCRM.constant('account').subdomain + '.amocrm.ru/api/v2/leads?id=' + AMOCRM.data.card_page.id, function(result) {

            var cf = result['_embedded']['items'][0]['custom_fields'];
            var lead = result['_embedded']['items'][0];
            var i = false;
            $.each(cf, function(id_roistat, value_roistat) {
                if (value_roistat.name == 'roiastat_id') {
                    var roistat_id = value_roistat.id;
                }
            })

            $.each(cf, function(key, value) {
                if (value.name == 'Создать еще сделку') {
                    $.each(value.values, function(id, job) {
                        $.get('https://' + AMOCRM.constant('account').subdomain + '.amocrm.ru/api/v2/account?with=custom_fields', function(all_cf) {
                            $.each(all_cf['_embedded']['custom_fields']['leads'], function(id_all, name_all) {
                                if (name_all.name == 'Вид работы') {
                                    $.each(name_all.enums, function(id_job, name_job) {

                                        if (name_job == job.value) {
                                            if (i == false) {
                                                i = true;
                                                $.ajax({
                                                    url: 'https://' + AMOCRM.constant('account').subdomain + '.amocrm.ru/api/v2/leads/',
                                                    method: 'POST',
                                                    data: {
                                                        "update": [{
                                                            "id": AMOCRM.data.card_page.id,
                                                            "updated_at": Date.now(),
                                                            "custom_fields": [{
                                                                    "id": id_all,
                                                                    "values": [{
                                                                        "value": id_job
                                                                    }]
                                                                },
                                                                {
                                                                    "id": id_field_roistate,
                                                                    "values": [{
                                                                        "value": "123123"
                                                                    }]
                                                                }
                                                            ]
                                                        }]
                                                    }
                                                })
                                            } else {
                                                if (name_all.name == 'roiastat_id') {
                                                    var rid_cf = id_all;
                                                }
                                                var roistat_id
                                                $.ajax({
                                                    url: 'https://' + AMOCRM.constant('account').subdomain + '.amocrm.ru/api/v2/leads/',
                                                    method: 'POST',
                                                    data: {
                                                        "add": [{
                                                            "name": lead.name,
                                                            "contacts_id": lead['main_contact'],
                                                            "custom_fields": [{
                                                                    "id": rid_cf,
                                                                    "values": [{
                                                                        "value": roistat_id
                                                                    }]
                                                                },
                                                                {
                                                                    "id": id_field_roistate,
                                                                    "values": [{
                                                                        "value": "123123"
                                                                    }]
                                                                }
                                                            ]
                                                        }]
                                                    }
                                                });
                                            }
                                        }

                                    })

                                }
                            })
                        })
                    })
                }
            })
            clearValuesMultySelect(); // сбрасываем значения мультисписка
        })

    }
    setTimeout(createLead, 3000);
})