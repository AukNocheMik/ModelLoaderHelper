
    var renderer;
    var normalRadius;
    var groupObj = new THREE.Group();       //obj模型组
    var groupSTl = new THREE.Group();       //stl模型组
    var groupObjct = new THREE.Group();
    function initRender() {                 //渲染方式
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(innerWidth, innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.setClearColor(0xB9D3EE);           //场景渲染颜色  ffffff 为白色，可以调低 dddddd 为浅灰色
        document.getElementById("container").appendChild(renderer.domElement);

    }

    var camera;
    var loaderUrl = "model/PD_185A1341-7.stl";    //stl模型传入路径
    function initCamera() {
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100000);
        camera.position.set(23, 10, -25.7);         //摄像机位置
    }
    var scene;
    function initScene() {
        
     scene = new THREE.Scene();


        var loader = new THREE.STLLoader();
        var texture = new THREE.Texture();               //加载图片的logo，打开即可启用

        //加载图片
        var imgLoader = new THREE.ImageLoader();
        imgLoader.load('logoLeft.png',function(img)
        {
            //将图片值赋于纹理
            texture.image = img;
            texture.needsUpdate = true;
                 var geometry = new THREE.PlaneGeometry( 60, 20, 32 );
                var material = new THREE.MeshBasicMaterial( {side:THREE.DoubleSide,map:texture} );
                var plane = new THREE.Mesh( geometry, material );
                plane.material.transparent = true;
                plane.rotation.x = Math.PI/2;
                plane.rotation.y = Math.PI;
                plane.position.set(0,-20,0);
                scene.add( plane );


        });

        var objloader = new THREE.OBJLoader();              //obj模型加载
        var loader = new THREE.STLLoader();



        objloader.load('model/3DModel.obj',function (obj) {
            obj.children[0].geometry.computeBoundingSphere();
            var objPosition =  obj.children[0].geometry.boundingSphere.center;  //获取模型偏移量
            obj.position.set(-objPosition.x,-objPosition.y,-objPosition.z);     //将模型放在中心
            normalRadius = obj.children[0].geometry.boundingSphere.radius;      //获取缩放
            groupObj.add(obj);
            groupObj.scale.set(0.01,0.01,0.01);                                 //对象缩放
            groupObj.children[0].visible = true;                                //加载后显示
            scene.add(groupObj);

            loader.load( loaderUrl, function ( geometry ) {        //stl模型加载   logo模型的加载
                var material = new THREE.MeshPhongMaterial( );
                var mesh = new THREE.Mesh( geometry, material );
                mesh.geometry.computeBoundingSphere();
                var objPosition =  mesh.geometry.boundingSphere.center;     //获取stl模型偏移量
                var meshRadius = mesh.geometry.boundingSphere.radius;       //获取缩放
                var count = Math.round(normalRadius/meshRadius) ;           //定义缩放系数
                mesh.position.set(-objPosition.x,-objPosition.y,-objPosition.z);//位置归零
                groupSTl.add(mesh);
                groupSTl.scale.set(0.01*count,0.01*count,0.01*count);//设置动态缩放
                groupSTl.children[0].visible = false;               //加载后不显示
                console.log(groupSTl);
                scene.add(groupSTl);

            } );

            loader.load( 'Winho.stl', function ( geometry ) {        // LOGO stl模型加载
                var material = new THREE.MeshPhongMaterial( );
                var mesh = new THREE.Mesh( geometry, material );
                mesh.geometry.computeBoundingSphere();
                var objPosition =  mesh.geometry.boundingSphere.center;     //获取stl模型偏移量
                var meshRadius = mesh.geometry.boundingSphere.radius;       //获取缩放
                var count = Math.round(normalRadius/meshRadius) ;           //定义缩放系数
                mesh.position.set(-objPosition.x,-objPosition.y,-objPosition.z-130);//位置归零,向下移动位置  logo模型位置设定比场景物体的位置-130
                                                                                    //定义不同的logo位置可以在此处更改。干涉问题是因为logo的模型初始位置不同导致；
                groupObjct.scale.set(0.01*count,0.01*count,0.01*count);//设置动态缩放
                groupObjct.add(mesh);
                groupObjct.rotation.y = Math.PI;
                groupObjct.rotation.x = Math.PI/2;
                scene.add(groupObjct);

            } );
        });

     }
     function loadOBJModel(){       //obj模型加载

         groupObj.children[0].visible = true;  //obj 显示
         groupSTl.children[0].visible = false;//stl不显示
         alert('obj模型加载成功')  //提示，可以去掉

     }
     function loadSTLModel() {          //stl模型加载

         groupObj.children[0].visible = false;//obj不显示
         groupSTl.children[0].visible = true;//stl显示
         alert('stl模型加载成功')     //提示，可以去掉
     }




    function initLight() {      //灯光渲染
        var directionLight = new THREE.DirectionalLight(0xffffff,0.6);
        directionLight.position.y = 0;
        directionLight.rotation.z  = 0;
        scene.add(directionLight);
        var pointLight = new THREE.PointLight( 0xffffff, 0.4 );     //电光源灯光，cccccc为浅灰色，ffffff为白色，小数为光照强度
        camera.add( pointLight );
        scene.add( camera );
    }

    var controls;

    function initControls() {           //控制脚本
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', render);
        controls.enableDamping = true;               //定义可以拖拽
        controls.dampingFactor = 0.3;
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.rotateSpeed = 0.3;                 //控制旋转速度
        controls.zoomSpeed = 0.5;                   //缩放速度
        controls.autoRotateSpeed = 0.6;             //自动旋转速度
        controls.dampingFactor = 0.6;
        controls.autoRotate = false;                //控制是否自动旋转

    }

    function render() {
        renderer.render(scene, camera);

    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        render();
        renderer.setSize(window.innerWidth, window.innerHeight);
        //controls.handleResize();
    }

    function animate() {
        render();
       // controls.update();
        requestAnimationFrame(animate);
    }


    function draw() {       //初始化方法
        initCamera();
        initRender();
        initScene();
        initLight();
       initControls();
        animate();
        // json();

        window.onresize = onWindowResize;
    }