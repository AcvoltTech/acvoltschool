    // ===== MULTI-FILE TASK UPLOAD SYSTEM =====
    var _tc = typeof _t === 'function' ? _t : function(k, fb) { return fb || k; };
    let taskSelectedFiles = [];
    const MAX_TASK_FILES = 10;
    const MAX_TASK_FILE_SIZE = 50 * 1024 * 1024; // 50MB (videos)

    function handleTaskFileSelect(input) {
      const newFiles = Array.from(input.files);
      addTaskFiles(newFiles);
      input.value = ''; // Reset so same file can be re-selected
    }

    function handleTaskFileDrop(event) {
      event.preventDefault();
      event.stopPropagation();
      const newFiles = Array.from(event.dataTransfer.files);
      addTaskFiles(newFiles);
    }

    function addTaskFiles(newFiles) {
      const validTypes = ['application/pdf','image/jpeg','image/png','image/heic','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','video/mp4','video/quicktime','video/webm'];
      let rejected = [];
      
      newFiles.forEach(f => {
        if (taskSelectedFiles.length >= MAX_TASK_FILES) {
          rejected.push(f.name + ' (' + _tc('su_max_files', 'máximo') + ' ' + MAX_TASK_FILES + ' ' + _tc('su_files', 'archivos') + ')');
          return;
        }
        if (f.size > MAX_TASK_FILE_SIZE) {
          rejected.push(f.name + ' (' + _tc('su_exceeds_50mb', 'mayor a 50MB') + ')');
          return;
        }
        // Accept common image/doc/video types even if MIME is empty (mobile quirk)
        const ext = f.name.toLowerCase().split('.').pop();
        const validExts = ['pdf','jpg','jpeg','png','heic','doc','docx','mp4','mov','webm'];
        if (!validTypes.includes(f.type) && !validExts.includes(ext)) {
          rejected.push(f.name + ' (' + _tc('su_unsupported_type', 'tipo no soportado') + ')');
          return;
        }
        // Avoid duplicates
        if (!taskSelectedFiles.find(sf => sf.name === f.name && sf.size === f.size)) {
          taskSelectedFiles.push(f);
        }
      });

      if (rejected.length > 0) {
        window.MaestroDialog.alert({title: 'Atención', message: '⚠️ ' + _tc('su_rejected_files', 'Archivos rechazados') + ':\n' + rejected.join('\n'), kind: 'warning'});
      }

      renderTaskFilePreviews();
    }

    function removeTaskFile(index) {
      taskSelectedFiles.splice(index, 1);
      renderTaskFilePreviews();
    }

    function renderTaskFilePreviews() {
      const container = document.getElementById('taskFilePreview');
      if (taskSelectedFiles.length === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        // Restore drop zone text
        document.getElementById('taskDropZone').querySelector('p').textContent = _tc('upload_drop_zone', 'Toca aquí o arrastra tus fotos/archivos/videos');
        return;
      }
      
      container.style.display = 'flex';
      let html = '';
      taskSelectedFiles.forEach((f, i) => {
        const isImage = f.type.startsWith('image/') || ['jpg','jpeg','png','heic'].includes(f.name.toLowerCase().split('.').pop());
        const isVideo = f.type.startsWith('video/') || ['mp4','mov','webm'].includes(f.name.toLowerCase().split('.').pop());
        const sizeKB = (f.size / 1024).toFixed(0);
        const sizeStr = sizeKB > 1024 ? (f.size / 1048576).toFixed(1) + 'MB' : sizeKB + 'KB';
        const icon = isImage ? '🖼️' : isVideo ? '🎬' : f.name.endsWith('.pdf') ? '📄' : '📎';

        html += '<div style="position:relative;width:90px;text-align:center;" id="taskFileItem' + i + '">';
        if (isImage) {
          html += '<div style="width:90px;height:90px;border-radius:10px;overflow:hidden;border:2px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;">';
          html += '<img src="' + URL.createObjectURL(f) + '" style="width:100%;height:100%;object-fit:cover;">';
          html += '</div>';
        } else if (isVideo) {
          html += '<div style="width:90px;height:90px;border-radius:10px;border:2px solid #9b59b6;background:#f5f0ff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:2px;">';
          html += '<span style="font-size:32px;">🎬</span>';
          html += '<span style="font-size:9px;color:#9b59b6;">VIDEO</span>';
          html += '</div>';
        } else {
          html += '<div style="width:90px;height:90px;border-radius:10px;border:2px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.04);display:flex;align-items:center;justify-content:center;font-size:32px;">' + icon + '</div>';
        }
        html += '<button onclick="removeTaskFile(' + i + ')" style="position:absolute;top:-6px;right:-6px;background:#e74c3c;color:#fff;border:none;border-radius:50%;width:22px;height:22px;font-size:12px;cursor:pointer;line-height:22px;padding:0;">✕</button>';
        var safeName = f.name.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
        html += '<p style="font-size:10px;color:#666;margin:4px 0 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:90px;" title="' + safeName + '">' + safeName + '</p>';
        html += '<p style="font-size:9px;color:#aaa;margin:0;">' + sizeStr + '</p>';
        html += '</div>';
      });
      
      // Add "+" button to add more
      if (taskSelectedFiles.length < MAX_TASK_FILES) {
        html += '<div onclick="document.getElementById(\'taskFiles\').click()" style="width:90px;height:90px;border-radius:10px;border:2px dashed #ccc;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-direction:column;gap:4px;">';
        html += '<span style="font-size:24px;color:#aaa;">+</span>';
        html += '<span style="font-size:10px;color:#aaa;">' + _tc('su_add_more', 'Agregar') + '</span>';
        html += '</div>';
      }
      
      container.innerHTML = html;
      
      // Update drop zone text
      document.getElementById('taskDropZone').querySelector('p').textContent = taskSelectedFiles.length + ' ' + _tc('su_files_selected', 'archivo(s) seleccionado(s)');
    }

    // Extract a frame from a video file at 25% of duration using canvas API
    function extractVideoFrame(videoFile) {
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        const url = URL.createObjectURL(videoFile);
        video.src = url;
        video.onloadedmetadata = () => {
          video.currentTime = video.duration * 0.25;
        };
        video.onseeked = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = Math.min(video.videoWidth, 1280);
            canvas.height = Math.round(canvas.width * (video.videoHeight / video.videoWidth));
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(blob => {
              URL.revokeObjectURL(url);
              if (blob) {
                resolve(new File([blob], videoFile.name.replace(/\.[^.]+$/, '_frame.jpg'), { type: 'image/jpeg' }));
              } else {
                reject(new Error(_tc('su_frame_extract_error', 'No se pudo extraer frame del video')));
              }
            }, 'image/jpeg', 0.85);
          } catch(e) {
            URL.revokeObjectURL(url);
            reject(e);
          }
        };
        video.onerror = () => { URL.revokeObjectURL(url); reject(new Error(_tc('su_video_load_error', 'Error cargando video'))); };
        // Timeout after 15s
        setTimeout(() => { URL.revokeObjectURL(url); reject(new Error(_tc('su_frame_timeout', 'Timeout extrayendo frame'))); }, 15000);
      });
    }

    // Show AI grade card after grading
    function showGradeCard(result) {
      const gradeColor = result.grade >= 90 ? '#2ecc71' : result.grade >= 80 ? '#27ae60' : result.grade >= 70 ? '#f39c12' : result.grade >= 60 ? '#e67e22' : '#e74c3c';
      const categoryLabels = {
        cableado: _tc('su_cat_wiring', 'Cableado y Conexiones'),
        seguridad: _tc('su_cat_safety', 'Seguridad'),
        codigo_nec: _tc('su_cat_nec', 'Código NEC'),
        componentes: _tc('su_cat_components', 'Componentes'),
        calidad: _tc('su_cat_quality', 'Calidad de Trabajo'),
        documentacion: _tc('su_cat_documentation', 'Documentación')
      };

      let catHtml = '';
      if (result.categories) {
        Object.entries(result.categories).forEach(function(entry) {
          var key = entry[0];
          var val = entry[1];
          var label = categoryLabels[key] || key;
          var barColor = val >= 90 ? '#2ecc71' : val >= 80 ? '#27ae60' : val >= 70 ? '#f39c12' : val >= 60 ? '#e67e22' : '#e74c3c';
          catHtml += '<div style="margin-bottom:8px;">' +
            '<div style="display:flex;justify-content:space-between;font-size:0.85em;margin-bottom:2px;"><span>' + label + '</span><span style="font-weight:bold;color:' + barColor + ';">' + val + '/100</span></div>' +
            '<div style="background:rgba(255,255,255,0.08);border-radius:4px;height:6px;overflow:hidden;"><div style="background:' + barColor + ';height:100%;width:' + val + '%;transition:width 0.5s;"></div></div>' +
          '</div>';
        });
      }

      var strengthsHtml = '';
      if (result.strengths && result.strengths.length > 0) {
        strengthsHtml = '<div style="margin-top:12px;"><strong style="color:#2ecc71;">' + _tc('su_strengths', 'Fortalezas') + ':</strong><ul style="margin:5px 0;padding-left:20px;">';
        result.strengths.forEach(function(s) { strengthsHtml += '<li style="font-size:0.85em;margin-bottom:3px;">' + s + '</li>'; });
        strengthsHtml += '</ul></div>';
      }

      var improvHtml = '';
      if (result.improvements && result.improvements.length > 0) {
        improvHtml = '<div style="margin-top:8px;"><strong style="color:#e67e22;">' + _tc('su_improvements', 'Areas de Mejora') + ':</strong><ul style="margin:5px 0;padding-left:20px;">';
        result.improvements.forEach(function(s) { improvHtml += '<li style="font-size:0.85em;margin-bottom:3px;">' + s + '</li>'; });
        improvHtml += '</ul></div>';
      }

      var overlay = document.createElement('div');
      overlay.id = 'gradeCardOverlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;';
      overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };

      overlay.innerHTML = '<div style="background:#0b1425;border:1px solid rgba(255,255,255,0.1);border-radius:16px;max-width:500px;width:100%;max-height:90vh;overflow-y:auto;padding:25px;position:relative;">' +
        '<button onclick="document.getElementById(\'gradeCardOverlay\').remove()" style="position:absolute;top:10px;right:15px;background:none;border:none;font-size:20px;cursor:pointer;color:rgba(180,200,230,0.5);">✕</button>' +
        '<div style="text-align:center;margin-bottom:15px;">' +
          '<div style="font-size:14px;color:rgba(180,200,230,0.6);margin-bottom:5px;">' + _tc('su_ai_grade', 'Calificación IA') + '</div>' +
          '<div style="font-size:64px;font-weight:bold;color:' + gradeColor + ';line-height:1;">' + result.grade + '</div>' +
          '<div style="font-size:14px;color:rgba(180,200,230,0.5);">' + _tc('su_out_of_100', 'de 100') + '</div>' +
        '</div>' +
        '<div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:12px;margin-bottom:15px;">' +
          '<p style="font-size:0.9em;color:rgba(200,215,240,0.85);margin:0;">' + (result.feedback || '') + '</p>' +
        '</div>' +
        '<div style="margin-bottom:10px;color:#f0f4fa;"><strong>' + _tc('su_category_breakdown', 'Desglose por Categoría') + ':</strong></div>' +
        catHtml +
        strengthsHtml +
        improvHtml +
        '<div style="text-align:center;margin-top:15px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);">' +
          '<button onclick="document.getElementById(\'gradeCardOverlay\').remove()" style="padding:10px 30px;background:' + gradeColor + ';color:#fff;border:none;border-radius:8px;font-weight:bold;cursor:pointer;">' + _tc('understood', 'Entendido') + '</button>' +
        '</div>' +
      '</div>';

      document.body.appendChild(overlay);
    }

    async function submitCompletedTask() {
      const taskType = document.getElementById('taskToSubmit')?.value;
      const notes = document.getElementById('taskNotes')?.value || '';
      const btn = document.getElementById('btnSubmitTask');
      
      if (!taskType) { window.showToast(_tc('su_select_doc_type', 'Selecciona el tipo de documento'), 'warning'); return; }
      if (taskSelectedFiles.length === 0) { window.showToast(_tc('su_select_file', 'Selecciona al menos un archivo o foto'), 'warning'); return; }

      if (!supabaseClient) { window.MaestroDialog.alert({title: 'Error', message: _tc('su_no_connection', 'Error: Sin conexión a Supabase'), kind: 'error'}); return; }

      // Get user info
      const email = localStorage.getItem('tecnico_email') || '';
      const nombre = (currentUser && currentUser.nombre) ? currentUser.nombre : (JSON.parse(localStorage.getItem('tecnico_user') || '{}').nombre || 'Estudiante');

      if (!email) { window.MaestroDialog.alert({title: 'Atención', message: _tc('su_login_required', 'Debes iniciar sesión primero'), kind: 'warning'}); return; }
      
      // Disable button and show progress
      btn.disabled = true;
      btn.textContent = '⏳ ' + _tc('upload_uploading', 'Subiendo...');
      btn.style.background = '#95a5a6';
      
      const progressDiv = document.getElementById('taskUploadProgress');
      const progressBar = document.getElementById('taskUploadBar');
      const progressStatus = document.getElementById('taskUploadStatus');
      progressDiv.style.display = 'block';
      
      try {
        let uploadedUrls = [];
        let uploadedNames = [];
        const totalFiles = taskSelectedFiles.length;
        
        for (let i = 0; i < totalFiles; i++) {
          const file = taskSelectedFiles[i];
          const pct = Math.round(((i) / totalFiles) * 100);
          progressBar.style.width = pct + '%';
          progressStatus.textContent = _tc('upload_uploading_file', 'Subiendo archivo') + ' ' + (i + 1) + ' ' + _tc('upload_of', 'de') + ' ' + totalFiles + '...';
          
          // Create unique filename
          const ext = file.name.split('.').pop();
          const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
          const fileName = safeEmail + '/' + Date.now() + '_' + (i + 1) + '_' + file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const path = 'tasks/' + fileName;
          
          const uploadRes = await supabaseClient.storage.from('school-files').upload(path, file);
          if (uploadRes.error) throw new Error(_tc('su_upload_error', 'Error subiendo') + ' ' + file.name + ': ' + uploadRes.error.message);
          
          const publicUrl = supabaseClient.storage.from('school-files').getPublicUrl(path).data.publicUrl;
          uploadedUrls.push(publicUrl);
          uploadedNames.push(file.name);
        }
        
        // Extract video frames and upload them
        progressBar.style.width = '80%';
        progressStatus.textContent = _tc('upload_processing_videos', 'Procesando videos...');
        let videoFrameUrls = [];
        for (let i = 0; i < taskSelectedFiles.length; i++) {
          const file = taskSelectedFiles[i];
          const isVideo = file.type.startsWith('video/') || ['mp4','mov','webm'].includes(file.name.toLowerCase().split('.').pop());
          if (isVideo) {
            try {
              const frameFile = await extractVideoFrame(file);
              const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
              const framePath = 'tasks/' + safeEmail + '/' + Date.now() + '_frame_' + frameFile.name.replace(/[^a-zA-Z0-9._-]/g, '_');
              const frameUpload = await supabaseClient.storage.from('school-files').upload(framePath, frameFile);
              if (!frameUpload.error) {
                const frameUrl = supabaseClient.storage.from('school-files').getPublicUrl(framePath).data.publicUrl;
                videoFrameUrls.push(frameUrl);
              }
            } catch(vErr) {
              console.warn('Could not extract video frame:', vErr);
            }
          }
        }

        progressBar.style.width = '90%';
        progressStatus.textContent = _tc('upload_saving_record', 'Guardando registro...');

        // Insert into submitted_tasks table — use .select('id').single() to get the ID back
        const insertData = {
          student_email: email,
          student_name: nombre,
          task_type: taskType,
          notes: notes,
          file_url: uploadedUrls[0], // Primary file URL
          file_urls: uploadedUrls, // All file URLs (JSONB)
          file_names: uploadedNames, // All file names (JSONB)
          file_count: totalFiles,
          status: 'pending',
          submitted_at: new Date().toISOString(),
          has_video: videoFrameUrls.length > 0,
          video_frame_urls: videoFrameUrls.length > 0 ? videoFrameUrls : null
        };

        const insertRes = await supabaseClient.from('submitted_tasks').insert(insertData).select('id').single();
        if (insertRes.error) throw insertRes.error;
        const taskId = insertRes.data.id;

        // Also update student_tasks if a specific task was selected by ID
        const taskSelect = document.getElementById('taskToSubmit');
        const selectedOption = taskSelect.options[taskSelect.selectedIndex];
        if (selectedOption && selectedOption.value && selectedOption.value.match(/^[0-9a-f-]{36}$/)) {
          await supabaseClient.from('student_tasks').update({
            status: 'completada',
            completed_at: new Date().toISOString(),
            student_notes: notes,
            file_url: uploadedUrls[0]
          }).eq('id', selectedOption.value);
        }

        // Determine if there are images to grade (filter out PDFs/docs — only images/video frames)
        const imageExts = ['jpg','jpeg','png','gif','webp'];
        const imageUrls = uploadedUrls.filter(function(url, idx) {
          var name = (uploadedNames[idx] || '').toLowerCase();
          var ext = name.split('.').pop();
          return imageExts.includes(ext);
        });

        const hasGradeableImages = imageUrls.length > 0 || videoFrameUrls.length > 0;

        let gradeResult = null;
        if (hasGradeableImages) {
          // Call AI grading (non-blocking — if it fails, submission still succeeds)
          try {
            progressBar.style.width = '95%';
            progressStatus.textContent = _tc('upload_grading_ai', 'Calificando con IA...');
            btn.textContent = '🤖 ' + _tc('su_ai_grading', 'IA calificando...');

            const gradeRes = await supabaseClient.functions.invoke('grade-task', {
              body: {
                taskId: taskId,
                imageUrls: imageUrls,
                videoFrameUrls: videoFrameUrls,
                taskType: taskType,
                studentNotes: notes,
                studentName: nombre
              }
            });

            if (gradeRes.data && gradeRes.data.success) {
              gradeResult = gradeRes.data;
            } else if (gradeRes.data && gradeRes.data.skipped) {
              console.log('AI grading skipped:', gradeRes.data.reason);
            } else {
              console.warn('AI grading returned error:', gradeRes.data?.error || gradeRes.error);
            }
          } catch(aiErr) {
            console.warn('AI grading failed (non-blocking):', aiErr);
          }
        }

        progressBar.style.width = '100%';
        progressStatus.textContent = '✅ ' + _tc('su_sent', '¡Enviado!');

        // Success notification
        const gradeNote = gradeResult ? ' | ' + _tc('su_ai_grade_short', 'Nota IA') + ': ' + gradeResult.grade + '/100' : '';
        addNotification('checkin', '📝 ' + _tc('su_task_sent', 'Tarea enviada') + ': ' + taskType + ' (' + totalFiles + ' ' + _tc('su_files', 'archivos') + ')' + gradeNote, '📝');
        notifyAdmin(_tc('su_task_sent', 'Tarea Enviada'), nombre + ' ' + _tc('su_submitted', 'envió') + ': ' + taskType, 'task');

        // Reset form and show result
        setTimeout(() => {
          taskSelectedFiles = [];
          renderTaskFilePreviews();
          document.getElementById('taskNotes').value = '';
          document.getElementById('taskToSubmit').value = '';
          progressDiv.style.display = 'none';
          progressBar.style.width = '0%';
          btn.disabled = false;
          btn.textContent = '✅ ' + _tc('su_submit_task', 'ENVIAR TAREA');
          btn.style.background = '#2ecc71';
          loadStudentTasks();
          if (typeof loadStudentSubmittedTasks === 'function') loadStudentSubmittedTasks();
          if (typeof loadStudentGrades === 'function') loadStudentGrades();

          if (gradeResult) {
            showGradeCard(gradeResult);
          } else {
            if (typeof window.showToast === 'function') window.showToast(_tc('su_task_sent_success', '¡Tarea enviada exitosamente!') + ' (' + totalFiles + ' ' + _tc('su_files', 'archivos') + ')', 'success'); else window.MaestroDialog.alert({title: '', message: '✅ ' + _tc('su_task_sent_success', '¡Tarea enviada exitosamente!') + '\n' + totalFiles + ' ' + _tc('su_files', 'archivos') + '.' + (hasGradeableImages ? '\n\n' + _tc('su_ai_unavailable', 'La calificación IA no estuvo disponible. El instructor revisará manualmente.') : ''), kind: 'success'});
          }
        }, 800);
        
      } catch(e) {
        console.error('Error submitting task:', e);
        progressDiv.style.display = 'none';
        btn.disabled = false;
        btn.textContent = '✅ ' + _tc('su_submit_task', 'ENVIAR TAREA');
        btn.style.background = '#2ecc71';
        window.MaestroDialog.alert({title: 'Error', message: '❌ ' + _tc('su_error_sending', 'Error al enviar tarea') + ': ' + e.message + '\n\n' + _tc('su_try_again', 'Intenta de nuevo.'), kind: 'error'});
      }
    }

