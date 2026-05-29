// ====================================================================
// 3D 图层动画生成器 - 主脚本
// ====================================================================

$(document).ready(function() {
    // ================================================================
    // 初始化
    // ================================================================
    initializeUI();
    attachEventHandlers();
    updateCompInfo();

    // 每3秒刷新一次合成信息
    setInterval(updateCompInfo, 3000);
});

// ====================================================================
// UI 初始化
// ====================================================================
function initializeUI() {
    // 初始化滑块和数值关联
    $('#cameraDistance').on('input', function() {
        $('#cameraDistanceValue').val(this.value);
    });

    $('#cameraDistanceValue').on('input', function() {
        var val = parseInt(this.value);
        if (val >= 500 && val <= 3000) {
            $('#cameraDistance').val(val);
        }
    });

    // 旋转强度
    $('#rotationIntensity').on('input', function() {
        var val = parseFloat(this.value).toFixed(1);
        $('#rotationValue').text(val + 'x');
    });

    // 旋转角度
    $('#rotationX').on('input', function() {
        $('#rotationXValue').text(this.value + '°');
    });

    $('#rotationY').on('input', function() {
        $('#rotationYValue').text(this.value + '°');
    });
}

// ====================================================================
// 事件处理
// ====================================================================
function attachEventHandlers() {
    // 刷新信息
    $('#refreshBtn').on('click', function() {
        $(this).text('🔄 刷新中...');
        updateCompInfo();
        setTimeout(() => {
            $(this).text('🔄 刷新信息');
        }, 500);
    });

    // 预览按钮
    $('#previewBtn').on('click', function() {
        previewAnimation();
    });

    // 应用动画按钮
    $('#applyBtn').on('click', function() {
        applyAnimation();
    });

    // 重置参数
    $('#resetBtn').on('click', function() {
        resetParameters();
    });
}

// ====================================================================
// 更新合成信息
// ====================================================================
function updateCompInfo() {
    var code = `
        if (app.project && app.project.activeItem) {
            var comp = app.project.activeItem;
            if (comp instanceof CompItem) {
                var result = {
                    name: comp.name,
                    width: comp.width,
                    height: comp.height,
                    duration: comp.duration.toFixed(2),
                    layerCount: comp.layers.length,
                    frameRate: comp.frameRate
                };
                JSON.stringify(result);
            }
        }
    `;

    csInterface.evalScript(code, function(result) {
        if (result && result !== 'undefined') {
            try {
                var data = JSON.parse(result);
                $('#compName').text(data.name);
                $('#compSize').text(data.width + ' × ' + data.height);
                $('#layerCount').text(data.layerCount);
                $('#compDuration').text(data.duration + ' 秒');
            } catch (e) {
                console.log('Parse error:', e);
            }
        }
    });
}

// ====================================================================
// 预览动画
// ====================================================================
function previewAnimation() {
    showStatus('预览功能开发中...');
    setTimeout(() => {
        hideStatus();
        alert('预览功能将在下个版本实现');
    }, 1500);
}

// ====================================================================
// 应用动画
// ====================================================================
function applyAnimation() {
    // 验证参数
    var duration = parseFloat($('#duration').val());
    var cameraDistance = parseFloat($('#cameraDistance').val());
    var rotationIntensity = parseFloat($('#rotationIntensity').val());
    var rotationX = parseInt($('#rotationX').val());
    var rotationY = parseInt($('#rotationY').val());
    var animationType = $('input[name="animationType"]:checked').val();
    var easeType = $('#easeType').val();

    var enable3D = $('#enable3D').is(':checked');
    var enableDepth = $('#enableDepth').is(':checked');
    var createCamera = $('#createCamera').is(':checked');
    var createLights = $('#createLights').is(':checked');
    var addMotionBlur = $('#addMotionBlur').is(':checked');
    var randomOffset = $('#randomOffset').is(':checked');

    if (isNaN(duration) || duration <= 0) {
        alert('❌ 动画时长必须大于0');
        return;
    }

    showStatus('应用动画中...', 0);
    disableAllButtons();

    // 准备调用AE脚本
    var params = {
        duration: duration,
        cameraDistance: cameraDistance,
        rotationIntensity: rotationIntensity,
        rotationX: rotationX,
        rotationY: rotationY,
        animationType: animationType,
        easeType: easeType,
        enable3D: enable3D,
        enableDepth: enableDepth,
        createCamera: createCamera,
        createLights: createLights,
        addMotionBlur: addMotionBlur,
        randomOffset: randomOffset
    };

    // 调用AE脚本
    callAEScript('apply3DAnimation', params, function(success, result) {
        hideStatus();
        enableAllButtons();

        if (success) {
            showSuccess('✅ 3D动画已成功应用！\n\n' +
                        '动画时长: ' + duration + ' 秒\n' +
                        '动画类型: ' + getAnimationTypeName(animationType) + '\n' +
                        '缓动效果: ' + getEaseTypeName(easeType));
        } else {
            alert('❌ 应用动画失败\n\n' + result);
        }
    });
}

// ====================================================================
// 重置参数
// ====================================================================
function resetParameters() {
    $('#duration').val('5');
    $('#cameraDistance').val('1500').trigger('input');
    $('#cameraDistanceValue').val('1500');
    $('#rotationIntensity').val('1').trigger('input');
    $('#rotationX').val('0').trigger('input');
    $('#rotationY').val('0').trigger('input');
    $('input[name="animationType"][value="rotate"]').prop('checked', true);
    $('#easeType').val('easeInOut');
    $('#enable3D').prop('checked', true);
    $('#enableDepth').prop('checked', true);
    $('#createCamera').prop('checked', true);
    $('#createLights').prop('checked', false);
    $('#addMotionBlur').prop('checked', false);
    $('#randomOffset').prop('checked', false);
}

// ====================================================================
// 调用AE脚本
// ====================================================================
var csInterface = new CSInterface();

function callAEScript(funcName, params, callback) {
    var code = 'var params = ' + JSON.stringify(params) + ';\n';
    code += 'var result = ' + funcName + '(params);\n';
    code += 'result;';

    csInterface.evalScript(code, function(result) {
        if (result && typeof result === 'string') {
            try {
                var parsed = JSON.parse(result);
                callback(parsed.success, parsed.message);
            } catch (e) {
                callback(false, '脚本执行错误');
            }
        } else {
            callback(false, '无法获取AE响应');
        }
    });
}

// ====================================================================
// 辅助函数
// ====================================================================
function showStatus(message, progress) {
    var bar = $('#statusBar');
    bar.removeClass('hidden');
    $('#statusText').text(message);
    if (typeof progress !== 'undefined') {
        $('#progressBar').css('width', progress + '%');
    }
}

function hideStatus() {
    $('#statusBar').addClass('hidden');
}

function showSuccess(message) {
    alert(message);
}

function disableAllButtons() {
    $('.btn').prop('disabled', true).css('opacity', '0.6');
}

function enableAllButtons() {
    $('.btn').prop('disabled', false).css('opacity', '1');
}

function getAnimationTypeName(type) {
    var names = {
        'rotate': '旋转动画 (Z轴)',
        'slide': '滑动动画 (3D透视)',
        'zoom': '缩放动画 (Z深度)',
        'wave': '波浪动画 (层级效果)'
    };
    return names[type] || '未知';
}

function getEaseTypeName(type) {
    var names = {
        'linear': '线性',
        'easeIn': '加速',
        'easeOut': '减速',
        'easeInOut': '加减速',
        'easeOutBounce': '弹性',
        'easeInCirc': '圆形加速'
    };
    return names[type] || '未知';
}