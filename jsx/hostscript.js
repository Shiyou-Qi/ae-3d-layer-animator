// ====================================================================
// 3D 图层动画生成器 - AE 主脚本
// ====================================================================

#target aftereffects
#targetengine main

/**
 * 应用3D动画
 */
function apply3DAnimation(params) {
    try {
        // 验证项目
        if (!app.project || !app.project.activeItem) {
            return JSON.stringify({
                success: false,
                message: '请先打开一个After Effects项目'
            });
        }

        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            return JSON.stringify({
                success: false,
                message: '请先选择一个合成'
            });
        }

        // 开始undo组
        app.beginUndoGroup('应用3D动画');

        try {
            // 第1步：启用3D图层
            if (params.enable3D) {
                enable3DLayers(comp);
            }

            // 第2步：设置图层深度
            if (params.enableDepth) {
                setLayerDepth(comp);
            }

            // 第3步：创建摄像机
            var camera = null;
            if (params.createCamera) {
                camera = createCamera(comp, params.cameraDistance);
            }

            // 第4步：创建灯光
            if (params.createLights) {
                createLights(comp);
            }

            // 第5步：应用图层动画
            applyLayerAnimations(comp, params);

            // 第6步：应用摄像机动画
            if (camera) {
                applyCameraAnimation(camera, comp, params);
            }

            // 第7步：应用运动模糊
            if (params.addMotionBlur) {
                addMotionBlurToLayers(comp);
            }

            app.endUndoGroup();

            return JSON.stringify({
                success: true,
                message: '动画应用成功'
            });

        } catch (error) {
            app.endUndoGroup();
            return JSON.stringify({
                success: false,
                message: '应用过程出错: ' + error.toString()
            });
        }

    } catch (error) {
        return JSON.stringify({
            success: false,
            message: '脚本执行错误: ' + error.toString()
        });
    }
}

/**
 * 启用3D图层
 */
function enable3DLayers(comp) {
    for (var i = 1; i <= comp.layers.length; i++) {
        var layer = comp.layers[i];
        if (layer && !layer.locked && layer.canSetThreeD) {
            try {
                layer.threeDLayer = true;
            } catch (e) {
                // 继续处理
            }
        }
    }
}

/**
 * 设置图层深度关系
 */
function setLayerDepth(comp) {
    var layerCount = comp.layers.length;
    var depthStep = 200;

    for (var i = 1; i <= layerCount; i++) {
        var layer = comp.layers[i];
        if (layer && layer.threeDLayer && !layer.locked) {
            try {
                var zPosition = (layerCount - i + 1) * depthStep;
                var currentPos = layer.position.value;
                layer.position.setValue([
                    currentPos[0],
                    currentPos[1],
                    zPosition
                ]);
            } catch (e) {
                // 继续处理
            }
        }
    }
}

/**
 * 创建摄像机
 */
function createCamera(comp, distance) {
    try {
        var cameraLayer = comp.layers.addCamera(
            '3D 摄像机',
            [comp.width / 2, comp.height / 2, -distance]
        );
        cameraLayer.autoOrient = AutoOrientType.OFF;
        return cameraLayer;
    } catch (e) {
        return null;
    }
}

/**
 * 创建灯光
 */
function createLights(comp) {
    try {
        // 关键灯
        var keyLight = comp.layers.addLight(
            '关键灯',
            [comp.width / 2 - 500, comp.height / 2 - 500, 500]
        );

        // 补光
        var fillLight = comp.layers.addLight(
            '补光',
            [comp.width / 2 + 500, comp.height / 2, 500]
        );
    } catch (e) {
        // 灯光创建失败
    }
}

/**
 * 应用图层动画
 */
function applyLayerAnimations(comp, params) {
    var framerate = comp.frameRate;
    var totalFrames = Math.round(params.duration * framerate);
    var startTime = comp.displayStartTime;
    var endTime = startTime + params.duration;

    for (var i = 1; i <= comp.layers.length; i++) {
        var layer = comp.layers[i];
        if (layer && layer.threeDLayer && !layer.locked && !layer.isNull) {
            try {
                applyLayerAnimation(
                    layer,
                    startTime,
                    endTime,
                    params
                );
            } catch (e) {
                // 继续处理下一个图层
            }
        }
    }
}

/**
 * 为单个图层应用动画
 */
function applyLayerAnimation(layer, startTime, endTime, params) {
    try {
        var currentPos = layer.position.value;
        var currentRot = layer.rotationZ.value;
        var delay = 0;

        // 随机延迟
        if (params.randomOffset) {
            delay = Math.random() * 0.3;
            startTime += delay;
        }

        if (params.animationType === 'rotate') {
            // Z轴旋转
            layer.rotationZ.setValueAtTime(startTime, currentRot);
            layer.rotationZ.setValueAtTime(
                endTime,
                currentRot + 360 * params.rotationIntensity
            );
            setEaseToKeys(layer.rotationZ, params.easeType);

        } else if (params.animationType === 'slide') {
            // 滑动动画
            var slideDistance = 200 * params.rotationIntensity;
            layer.position.setValueAtTime(startTime, currentPos);
            layer.position.setValueAtTime(endTime, [
                currentPos[0] + slideDistance,
                currentPos[1],
                currentPos[2]
            ]);
            setEaseToKeys(layer.position, params.easeType);

        } else if (params.animationType === 'zoom') {
            // 缩放动画 (Z深度)
            var zoomRange = 300 * params.rotationIntensity;
            var midTime = startTime + (endTime - startTime) / 2;

            layer.position.setValueAtTime(startTime, [
                currentPos[0],
                currentPos[1],
                currentPos[2] + zoomRange
            ]);
            layer.position.setValueAtTime(midTime, currentPos);
            layer.position.setValueAtTime(endTime, [
                currentPos[0],
                currentPos[1],
                currentPos[2] - zoomRange
            ]);
            setEaseToKeys(layer.position, params.easeType);

        } else if (params.animationType === 'wave') {
            // 波浪动画
            layer.rotationX.setValueAtTime(startTime, params.rotationX);
            layer.rotationX.setValueAtTime(endTime, -params.rotationX);
            layer.rotationY.setValueAtTime(startTime, params.rotationY);
            layer.rotationY.setValueAtTime(endTime, -params.rotationY);
            setEaseToKeys(layer.rotationX, params.easeType);
            setEaseToKeys(layer.rotationY, params.easeType);
        }

    } catch (e) {
        // 某些图层不支持这些属性
    }
}

/**
 * 应用摄像机动画
 */
function applyCameraAnimation(camera, comp, params) {
    try {
        var startTime = comp.displayStartTime;
        var endTime = startTime + params.duration;
        var camPos = camera.position.value;
        var camRot = camera.rotationZ.value;

        if (params.animationType === 'rotate') {
            // 摄像机旋转
            camera.rotationY.setValueAtTime(startTime, 0);
            camera.rotationY.setValueAtTime(endTime, -30);
            setEaseToKeys(camera.rotationY, params.easeType);

        } else if (params.animationType === 'slide') {
            // 摄像机侧移
            camera.position.setValueAtTime(startTime, camPos);
            camera.position.setValueAtTime(endTime, [
                camPos[0] - 300,
                camPos[1],
                camPos[2]
            ]);
            setEaseToKeys(camera.position, params.easeType);

        } else if (params.animationType === 'zoom') {
            // 摄像机推进
            camera.position.setValueAtTime(startTime, [
                camPos[0],
                camPos[1],
                camPos[2] - 500
            ]);
            camera.position.setValueAtTime(endTime, camPos);
            setEaseToKeys(camera.position, params.easeType);
        }

    } catch (e) {
        // 摄像机动画失败
    }
}

/**
 * 为属性的关键帧设置缓动
 */
function setEaseToKeys(prop, easeType) {
    try {
        var keyCount = prop.numKeys;
        if (keyCount >= 1) {
            for (var i = 1; i <= keyCount; i++) {
                var inEase = getEaseValue(easeType, true);
                var outEase = getEaseValue(easeType, false);
                prop.setTemporalEaseAtKey(i, [inEase], [outEase]);
            }
        }
    } catch (e) {
        // 缓动设置失败
    }
}

/**
 * 获取缓动值
 */
function getEaseValue(easeType, isIn) {
    var easeValues = {
        'linear': new KeyframeEase(0, 100),
        'easeIn': new KeyframeEase(0, isIn ? 50 : 100),
        'easeOut': new KeyframeEase(0, isIn ? 100 : 50),
        'easeInOut': new KeyframeEase(0, 30),
        'easeOutBounce': new KeyframeEase(0, 20),
        'easeInCirc': new KeyframeEase(0, 40)
    };
    return easeValues[easeType] || new KeyframeEase(0, 100);
}

/**
 * 添加运动模糊
 */
function addMotionBlurToLayers(comp) {
    try {
        for (var i = 1; i <= comp.layers.length; i++) {
            var layer = comp.layers[i];
            if (layer && !layer.locked && !layer.isNull) {
                layer.motionBlur = true;
            }
        }
        // 启用合成运动模糊
        comp.motionBlur = true;
    } catch (e) {
        // 运动模糊启用失败
    }
}

// 导出函数供CEP调用
if (typeof $ !== 'undefined' && $) {
    // CEP环境
    $.global.apply3DAnimation = apply3DAnimation;
}